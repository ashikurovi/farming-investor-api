import { HttpStatus } from '@nestjs/common';
import { DeedService } from './deed.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
export declare class DeedController {
    private readonly deedService;
    private readonly blobStorageService;
    constructor(deedService: DeedService, blobStorageService: BlobStorageService);
    create(files: {
        file?: any[];
        uploadPdf?: any[];
        signature?: any[];
    }, createDeedDto: CreateDeedDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/deed.entity").Deed;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            data: import("./entities/deed.entity").Deed[];
            meta: {
                totalItems: number;
                itemCount: number;
                itemsPerPage: number;
                totalPages: number;
                currentPage: number;
            };
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/deed.entity").Deed;
    }>;
    update(id: string, files: {
        file?: any[];
        uploadPdf?: any[];
        signature?: any[];
    }, updateDeedDto: UpdateDeedDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/deed.entity").Deed;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
