import { HttpStatus } from '@nestjs/common';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticeController {
    private readonly noticeService;
    private readonly blobStorageService;
    constructor(noticeService: NoticeService, blobStorageService: BlobStorageService);
    create(file: any, createNoticeDto: CreateNoticeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").NoticeEntity;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/notice.entity").NoticeEntity[];
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
        data: import("./entities/notice.entity").NoticeEntity;
    }>;
    update(id: string, file: any, updateNoticeDto: UpdateNoticeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").NoticeEntity;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
