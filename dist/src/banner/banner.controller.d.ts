import { HttpStatus } from '@nestjs/common';
import * as Express from 'express';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannerController {
    private readonly bannerService;
    private readonly blobStorageService;
    constructor(bannerService: BannerService, blobStorageService: BlobStorageService);
    create(file: Express.Multer.File, createBannerDto: CreateBannerDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/banner.entity").BannerEntity[];
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
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    update(id: string, file: Express.Multer.File, updateBannerDto: UpdateBannerDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
