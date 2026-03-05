import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment } from './entities/investment.entity';
import { UserEntity } from '../users/entities/user.entity';
export declare class InvestmentService {
    private readonly investmentRepo;
    private readonly userRepo;
    constructor(investmentRepo: Repository<Investment>, userRepo: Repository<UserEntity>);
    create(createInvestmentDto: CreateInvestmentDto): Promise<Investment>;
    findAll(): Promise<Investment[]>;
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
}
