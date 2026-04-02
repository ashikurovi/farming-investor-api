import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerInvestDto } from './dto/partner-invest.dto';
import { DistributeCommissionDto } from './dto/distribute-commission.dto';
export declare class PartnerController {
    private readonly partnerService;
    constructor(partnerService: PartnerService);
    create(createPartnerDto: CreatePartnerDto): Promise<import("../users/entities/user.entity").UserEntity>;
    findAll(): Promise<import("../users/entities/user.entity").UserEntity[]>;
    findOne(id: string): Promise<import("../users/entities/user.entity").UserEntity>;
    invest(id: string, dto: PartnerInvestDto): Promise<import("../investment/entities/investment.entity").Investment>;
    distributeCommission(dto: DistributeCommissionDto): Promise<{
        success: boolean;
        totalDistributed: number;
        totalPartnerInvestment: number;
        distributions: any[];
    }>;
}
