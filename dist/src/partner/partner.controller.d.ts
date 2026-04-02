import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerInvestDto } from './dto/partner-invest.dto';
import { DistributeCommissionDto } from './dto/distribute-commission.dto';
import { WithdrawProfitDto } from './dto/withdraw-profit.dto';
export declare class PartnerController {
    private readonly partnerService;
    constructor(partnerService: PartnerService);
    create(createPartnerDto: CreatePartnerDto): Promise<import("../users/entities/user.entity").UserEntity>;
    findAll(): Promise<import("../users/entities/user.entity").UserEntity[]>;
    getAllPayouts(): Promise<import("./entities/partner-payout.entity").PartnerPayout[]>;
    findOne(id: string): Promise<any>;
    invest(id: string, dto: PartnerInvestDto): Promise<import("../investment/entities/investment.entity").Investment>;
    distributeCommission(dto: DistributeCommissionDto): Promise<{
        success: boolean;
        totalDistributed: number;
        totalPartnerInvestment: number;
        distributions: any[];
    }>;
    withdrawProfit(id: string, dto: WithdrawProfitDto): Promise<{
        success: boolean;
        withdrawn: number;
        remainingProfit: number;
        reference: string;
    }>;
    getPayouts(id: string): Promise<import("./entities/partner-payout.entity").PartnerPayout[]>;
}
