export declare class BlobStorageService {
    private readonly logger;
    uploadUserPhoto(file: any): Promise<string>;
    uploadBannerPhoto(file: any): Promise<string>;
    uploadProjectImage(file: any): Promise<string>;
    uploadGlarryPhoto(file: any): Promise<string>;
    private upload;
}
