import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { InvestorTypeEntity } from '../investor-type/entities/investor-type.entity';
import { Investment } from '../investment/entities/investment.entity';
import { PartnerService } from '../partner/partner.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(InvestorTypeEntity)
    private readonly investorTypeRepository: Repository<InvestorTypeEntity>,
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    private readonly jwtService: JwtService,
    private readonly partnerService: PartnerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    let investorType: InvestorTypeEntity | null = null;
    if (createUserDto.investorTypeId != null) {
      investorType = await this.investorTypeRepository.findOne({
        where: { id: createUserDto.investorTypeId },
      });
      if (!investorType) {
        throw new BadRequestException('Investor type not found');
      }
    }
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      investorType: investorType ?? undefined,
    });
    return this.usersRepository.save(user);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<{
    items: UserEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search } = options;

    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.investorType', 'investorType');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('user.id', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items,
      meta: {
        total,
        page,
        limit: safeLimit,
        pageCount,
      },
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['investorType'],
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const usersRepo = manager.getRepository(UserEntity);
      const user = await usersRepo.findOne({
        where: { id },
        relations: ['investorType'],
      });
      if (!user) {
        throw new NotFoundException(`User with id "${id}" not found`);
      }

      let payload = { ...updateUserDto };
      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
        payload.password = hashedPassword;
      }

      let retroactiveDeduction = 0;

      if (updateUserDto.investorTypeId !== undefined) {
        if (updateUserDto.investorTypeId === null) {
          user.investorType = null;
          user.investorTypeId = null;
        } else {
          if (user.investorType?.id !== updateUserDto.investorTypeId) {
            const newType = await manager.getRepository(InvestorTypeEntity).findOne({
              where: { id: updateUserDto.investorTypeId },
            });
            if (newType) {
              const currentProfit = Number(user.totalProfit || 0);
              const newPercentage = Number(newType.percentage || 0);
              
              if (currentProfit > 0 && newPercentage > 0) {
                retroactiveDeduction = currentProfit * (newPercentage / 100);
                user.totalProfit = currentProfit - retroactiveDeduction;
              }
              
              user.investorType = newType;
              user.investorTypeId = updateUserDto.investorTypeId;
            }
          }
        }
      }

      const merged = usersRepo.merge(user, payload);
      const savedUser = await usersRepo.save(merged);

      if (retroactiveDeduction > 0) {
        await this.partnerService.distributeCommissionWithManager(manager, retroactiveDeduction);
      }

      return savedUser;
    });
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

  // Stateless logout: no server-side token storage to clear.
  // Kept for symmetry and future extensibility (e.g. token blacklist).
  async logout(): Promise<void> {
    return;
  }

  async investmentsWithStats(
    userId: number,
    options: { page?: number; limit?: number } = {},
  ): Promise<{
    items: Investment[];
    meta: { total: number; page: number; limit: number; pageCount: number };
    stats: {
      total: number;
      count: number;
      average: number;
      latestDate?: string;
      latestTime?: string;
    };
  }> {
    const user = await this.findOne(userId);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(1, options.limit ?? 10), 100);

    const qb = this.investmentRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.deeds', 'deeds')
      .where('inv.investorId = :userId', { userId })
      .orderBy('inv.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [items, total] = await qb.getManyAndCount();
    const pageCount = limit > 0 ? Math.ceil(total / limit) || 1 : 1;

    const raw = await this.investmentRepository
      .createQueryBuilder('inv')
      .select('SUM(inv.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(inv.amount)', 'average')
      .where('inv.investorId = :userId', { userId })
      .getRawOne<{
        total: string | null;
        count: string | null;
        average: string | null;
      }>();

    const latest = await this.investmentRepository
      .createQueryBuilder('inv')
      .where('inv.investorId = :userId', { userId })
      .orderBy('inv.date', 'DESC')
      .addOrderBy('inv.time', 'DESC')
      .addOrderBy('inv.id', 'DESC')
      .getOne();

    return {
      items,
      meta: { total, page, limit, pageCount },
      stats: {
        total: raw?.total != null ? Number(raw.total) : 0,
        count: raw?.count != null ? Number(raw.count) : 0,
        average: raw?.average != null ? Number(raw.average) : 0,
        latestDate: latest?.date,
        latestTime: latest?.time,
      },
    };
  }

  async withdrawProfit(userId: number): Promise<{
    userId: number;
    withdrawnProfit: number;
  }> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(UserEntity);
      const user = await repo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id "${userId}" not found`);
      }
      const withdrawnProfit = Number(user.totalProfit || 0);
      if (withdrawnProfit > 0) {
        await repo
          .createQueryBuilder()
          .update(UserEntity)
          .set({ 
            totalProfit: 0,
            withdrawnProfit: () => `"withdrawnProfit" + ${withdrawnProfit}`
          } as any)
          .where('id = :id', { id: userId })
          .execute();
      }
      return { userId, withdrawnProfit };
    });
  }

  async withdrawAll(userId: number): Promise<{
    userId: number;
    withdrawnProfit: number;
    withdrawnInvestment: number;
  }> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(UserEntity);
      const user = await repo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id "${userId}" not found`);
      }
      const withdrawnProfit = Number(user.totalProfit || 0);
      const withdrawnInvestment = Number(user.totalInvestment || 0);
      await repo
        .createQueryBuilder()
        .update(UserEntity)
        .set({ 
          totalProfit: 0, 
          totalInvestment: 0,
          withdrawnProfit: () => `"withdrawnProfit" + ${withdrawnProfit}`
        } as any)
        .where('id = :id', { id: userId })
        .execute();
      return { userId, withdrawnProfit, withdrawnInvestment };
    });
  }
}
