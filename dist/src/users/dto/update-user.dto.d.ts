import { UserRole } from '../entities/user.entity';
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    location?: string;
    role?: UserRole;
    photoUrl?: string;
}
