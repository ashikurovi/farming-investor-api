import { HttpStatus } from '@nestjs/common';
import { DailyReportService } from './daily-report.service';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { UpdateDailyReportDto } from './dto/update-daily-report.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
export declare class DailyReportController {
    private readonly dailyReportService;
    private readonly blobStorageService;
    constructor(dailyReportService: DailyReportService, blobStorageService: BlobStorageService);
    create(file: any, createDailyReportDto: CreateDailyReportDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/daily-report.entity").DailyReport;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/daily-report.entity").DailyReport[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/daily-report.entity").DailyReport;
    }>;
    update(id: string, updateDailyReportDto: UpdateDailyReportDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/daily-report.entity").DailyReport;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
