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
}
