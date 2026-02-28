import * as Express from 'express';
export declare class BlobStorageService {
    private readonly logger;
    uploadUserPhoto(file: Express.Multer.File): Promise<string>;
    uploadBannerPhoto(file: Express.Multer.File): Promise<string>;
    uploadProjectImage(file: Express.Multer.File): Promise<string>;
    private upload;
}
