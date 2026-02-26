import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<UserEntity>, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: UserEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number): Promise<UserEntity>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<void>;
    login(loginUserDto: LoginUserDto): Promise<{
        accessToken: string;
        user: UserEntity;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
    ban(id: number): Promise<UserEntity>;
    unban(id: number): Promise<UserEntity>;
}
