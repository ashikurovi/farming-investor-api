import { Repository } from 'typeorm';
import { InvestorTypeEntity } from './entities/investor-type.entity';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';
export type InvestorTypeResponse = {
    id: number;
    type: string;
    percentage: number;
};
export declare class InvestorTypeService {
    private readonly investorTypeRepo;
    constructor(investorTypeRepo: Repository<InvestorTypeEntity>);
    create(createInvestorTypeDto: CreateInvestorTypeDto): Promise<InvestorTypeResponse>;
    findAll(): Promise<InvestorTypeResponse[]>;
    findOne(id: number): Promise<InvestorTypeResponse>;
    update(id: number, updateInvestorTypeDto: UpdateInvestorTypeDto): Promise<InvestorTypeResponse>;
    remove(id: number): Promise<void>;
    private toResponse;
}
