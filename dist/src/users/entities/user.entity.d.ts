import { InvestorTypeEntity } from '../../investor-type/entities/investor-type.entity';
export declare enum UserRole {
    ADMIN = "admin",
    INVESTOR = "investor"
}
export declare class UserEntity {
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    location?: string;
    photoUrl?: string;
    role: UserRole;
    isBanned: boolean;
    investorTypeId?: number;
    investorType?: InvestorTypeEntity;
}
