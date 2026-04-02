import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment } from './entities/investment.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InvestamountService } from '../investamount/investamount.service';
export declare class InvestmentService {
    private readonly investmentRepo;
    private readonly userRepo;
    private readonly investAmountService;
    constructor(investmentRepo: Repository<Investment>, userRepo: Repository<UserEntity>, investAmountService: InvestamountService);
    create(createInvestmentDto: CreateInvestmentDto): Promise<{
        id: number;
        allIds: number[];
        count: number;
        investorId: number;
        investor: UserEntity;
        amount: number;
        reference?: string;
        photoUrl?: string;
        date?: string;
        time?: string;
        startDate?: string;
        endDate?: string;
        isActive: boolean;
        deeds: import("../deed/entities/deed.entity").Deed[];
    }>;
    findAll(): Promise<Investment[]>;
    stats(): Promise<{
        totalInvestmentCollect: number;
        totalInvestorCount: number;
        newInvestorCount: number;
    }>;
    findRecent(limit?: number): Promise<Array<{
        id: number;
        investorId: number;
        investorName?: string;
        amount: number;
        date?: string;
        time?: string;
    }>>;
    findOne(id: number): Promise<Investment>;
    update(id: number, updateInvestmentDto: UpdateInvestmentDto): Promise<Investment>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    refreshInvestmentStatuses(): Promise<void>;
    syncRetroactiveFinances(manager: any): Promise<void>;
}
