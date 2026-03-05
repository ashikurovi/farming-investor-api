import { HttpStatus } from '@nestjs/common';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { GlarryService } from './glarry.service';
import { CreateGlarryDto } from './dto/create-glarry.dto';
import { UpdateGlarryDto } from './dto/update-glarry.dto';
export declare class GlarryController {
    private readonly glarryService;
    private readonly blobStorageService;
    constructor(glarryService: GlarryService, blobStorageService: BlobStorageService);
    create(file: any, createGlarryDto: CreateGlarryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./glarry.service").GlarryResponse;
    }>;
    findAll(page?: string, limit?: string, projectId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./glarry.service").GlarryResponse[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    findByProject(projectId: string, page?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./glarry.service").GlarryResponse[];
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
        data: import("./glarry.service").GlarryResponse;
    }>;
    update(id: string, file: any, updateGlarryDto: UpdateGlarryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./glarry.service").GlarryResponse;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
