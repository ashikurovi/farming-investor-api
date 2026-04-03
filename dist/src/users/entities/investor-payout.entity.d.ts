import { UserEntity } from './user.entity';
export declare class InvestorPayout {
    id: number;
    investorId: number;
    investor: UserEntity;
    amount: number;
    totalInvestment: number;
    totalCost: number;
    totalProfit: number;
    reference: string;
    createdAt: Date;
}
