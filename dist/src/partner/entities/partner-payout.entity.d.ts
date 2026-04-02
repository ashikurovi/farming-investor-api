import { UserEntity } from '../../users/entities/user.entity';
export declare class PartnerPayout {
    id: number;
    partnerId: number;
    partner: UserEntity;
    amount: number;
    reference: string;
    createdAt: Date;
}
