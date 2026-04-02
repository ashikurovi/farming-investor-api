import { HttpStatus } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { UsersService } from '../users/users.service';
export declare class InvestmentController {
    private readonly investmentService;
    private readonly usersService;
    private readonly blobStorageService;
    constructor(investmentService: InvestmentService, usersService: UsersService, blobStorageService: BlobStorageService);
    create(file: any, createInvestmentDto: CreateInvestmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            id: number;
            allIds: number[];
            count: number;
            investorId: number;
            investor: import("../users/entities/user.entity").UserEntity;
            amount: number;
            reference?: string;
            photoUrl?: string;
            date?: string;
            time?: string;
            startDate?: string;
            endDate?: string;
            isActive: boolean;
            deeds: import("../deed/entities/deed.entity").Deed[];
        };
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").Investment[];
    }>;
    my(userId: number, page?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/investment.entity").Investment[];
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
    getStats(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            totalInvestmentCollect: number;
            totalInvestorCount: number;
            newInvestorCount: number;
        };
    }>;
    recent(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            id: number;
            investorId: number;
            investorName?: string;
            amount: number;
            date?: string;
            time?: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").Investment;
    }>;
    update(id: string, file: any, updateInvestmentDto: UpdateInvestmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").Investment;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
