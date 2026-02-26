import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{
    items: UserEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const {
      page = 1,
      limit = 10,
      search,
    } = options;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('user.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const pageCount = limit > 0 ? Math.ceil(total / limit) || 1 : 1;

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pageCount,
      },
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    let payload = updateUserDto;
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      payload = { ...updateUserDto, password: hashedPassword };
    }

    const merged = this.usersRepository.merge(user, payload);
    return this.usersRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('User is banned');
    }

    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // In a real app, send reset email here.
    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: resetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.usersRepository.save(user);
  }

  async ban(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);
    user.isBanned = true;
    return this.usersRepository.save(user);
  }

  async unban(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);
    user.isBanned = false;
    return this.usersRepository.save(user);
  }
}
