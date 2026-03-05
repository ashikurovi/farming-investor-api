import { UserEntity } from '../../users/entities/user.entity';
export declare class Investment {
    id: number;
    investorId: number;
    investor: UserEntity;
    amount: number;
    reference?: string;
    photoUrl?: string;
    date?: string;
    time?: string;
}
