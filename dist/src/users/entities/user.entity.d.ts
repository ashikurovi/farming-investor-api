import { InvestorTypeEntity } from '../../investor-type/entities/investor-type.entity';
export declare enum UserRole {
    ADMIN = "admin",
    INVESTOR = "investor",
    PARTNER = "partner"
}
export declare class UserEntity {
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    location?: string;
    photoUrl?: string;
    totalInvestment: number;
    totalProfit: number;
    balance: number;
    totalCost: number;
    lifetimeCost: number;
    lifetimeProfit: number;
    withdrawnProfit: number;
    role: UserRole;
    isBanned: boolean;
    investorTypeId?: number;
    investorType?: InvestorTypeEntity;
    createdAt: Date;
    updatedAt: Date;
}
