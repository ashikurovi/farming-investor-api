import { HttpStatus } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
export declare class InvestmentsController {
    private readonly investmentsService;
    constructor(investmentsService: InvestmentsService);
    invest(createInvestmentDto: CreateInvestmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").InvestmentEntity;
    }>;
    getStats(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            totalInvestments: number;
            totalAmountInvested: number;
            uniqueInvestors: number;
            uniqueProjectsInvested: number;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, projectId?: string, userId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/investment.entity").InvestmentEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    myInvestments(userId: number, page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/investment.entity").InvestmentEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    getInvestorsByProject(projectId: string, page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            investors: {
                userId: number;
                name: string;
                email: string;
                phone: string;
                amount: number;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    findByProject(projectId: string, page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/investment.entity").InvestmentEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investment.entity").InvestmentEntity;
    }>;
    remove(id: string, userId: number): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
