import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Investment } from '../investment/entities/investment.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerInvestDto } from './dto/partner-invest.dto';
import { DistributeCommissionDto } from './dto/distribute-commission.dto';
import { WithdrawProfitDto } from './dto/withdraw-profit.dto';
export declare class PartnerService {
    private readonly usersRepository;
    private readonly investmentRepository;
    constructor(usersRepository: Repository<UserEntity>, investmentRepository: Repository<Investment>);
    create(createPartnerDto: CreatePartnerDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    invest(partnerId: number, dto: PartnerInvestDto): Promise<Investment>;
    distributeCommission(dto: DistributeCommissionDto): Promise<{
        success: boolean;
        totalDistributed: number;
        totalPartnerInvestment: number;
        distributions: any[];
    }>;
    withdrawProfit(partnerId: number, dto: WithdrawProfitDto): Promise<{
        success: boolean;
        withdrawn: number;
        remainingProfit: number;
    }>;
    distributeCommissionWithManager(manager: any, commissionAmount: number): Promise<void>;
}
