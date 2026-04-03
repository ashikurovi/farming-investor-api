import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from './entities/user.entity';
import { InvestorTypeEntity } from '../investor-type/entities/investor-type.entity';
import { Investment } from '../investment/entities/investment.entity';
import { PartnerService } from '../partner/partner.service';
import { InvestorPayout } from './entities/investor-payout.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly investorTypeRepository;
    private readonly investmentRepository;
    private readonly jwtService;
    private readonly partnerService;
    constructor(usersRepository: Repository<UserEntity>, investorTypeRepository: Repository<InvestorTypeEntity>, investmentRepository: Repository<Investment>, jwtService: JwtService, partnerService: PartnerService);
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
    logout(): Promise<void>;
    investmentsWithStats(userId: number, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: Investment[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
        stats: {
            total: number;
            count: number;
            average: number;
            latestDate?: string;
            latestTime?: string;
        };
    }>;
    withdrawProfit(userId: number): Promise<{
        userId: number;
        withdrawnProfit: number;
    }>;
    withdrawAll(userId: number): Promise<{
        userId: number;
        withdrawnProfit: number;
        withdrawnInvestment: number;
    }>;
    payout(userId: number): Promise<InvestorPayout>;
    getPayouts(userId: number): Promise<InvestorPayout[]>;
    getAllPayouts(): Promise<InvestorPayout[]>;
}
