import { HttpStatus } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
export declare class InvestmentController {
    private readonly investmentService;
    private readonly blobStorageService;
    constructor(investmentService: InvestmentService, blobStorageService: BlobStorageService);
    create(file: any, createInvestmentDto: CreateInvestmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").Investment;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").Investment[];
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
