import { UserEntity } from '../../users/entities/user.entity';
import { Deed } from '../../deed/entities/deed.entity';
export declare class Investment {
    id: number;
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
    deeds: Deed[];
}
