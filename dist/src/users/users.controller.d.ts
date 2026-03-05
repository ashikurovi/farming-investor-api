import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BlobStorageService } from '../uploads/blob-storage.service';
export declare class UsersController {
    private readonly usersService;
    private readonly jwtService;
    private readonly blobStorageService;
    constructor(usersService: UsersService, jwtService: JwtService, blobStorageService: BlobStorageService);
    create(file: any, createUserDto: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/user.entity").UserEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            accessToken: string;
            user: import("./entities/user.entity").UserEntity;
        };
    }>;
    logout(): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    me(req: Request): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    update(id: number, file: any, updateUserDto: UpdateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    ban(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    unban(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    remove(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    withdrawProfit(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            userId: number;
            withdrawnProfit: number;
        };
    }>;
    withdrawAll(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            userId: number;
            withdrawnProfit: number;
            withdrawnInvestment: number;
        };
    }>;
    investments(id: string, page?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("../investment/entities/investment.entity").Investment[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
            stats: {
                total: number;
                count: number;
                average: number;
                latestDate?: string;
                latestTime?: string;
            };
        };
    }>;
}
