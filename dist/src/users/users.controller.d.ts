import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import type { Express, Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    create(req: Request, file: Express.Multer.File, createUserDto: CreateUserDto): Promise<{
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
    findOne(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            accessToken: string;
            user: import("./entities/user.entity").UserEntity;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    me(req: Request): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").UserEntity;
    }>;
    update(id: number, req: Request, file: Express.Multer.File, updateUserDto: UpdateUserDto): Promise<{
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
}
