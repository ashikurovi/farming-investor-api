"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BlobStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobStorageService = void 0;
const common_1 = require("@nestjs/common");
const blob_1 = require("@vercel/blob");
let BlobStorageService = BlobStorageService_1 = class BlobStorageService {
    constructor() {
        this.logger = new common_1.Logger(BlobStorageService_1.name);
    }
    async uploadUserPhoto(file) {
        if (!file || !file.buffer) {
            throw new common_1.InternalServerErrorException('No file buffer provided for upload');
        }
        try {
            const blob = await (0, blob_1.put)(`user-photos/${Date.now()}-${file.originalname}`, file.buffer, {
                access: 'public',
                addRandomSuffix: true,
            });
            return blob.url;
        }
        catch (error) {
            this.logger.error('Failed to upload file to Vercel Blob', error?.stack || error);
            throw new common_1.InternalServerErrorException('Failed to upload file');
        }
    }
};
exports.BlobStorageService = BlobStorageService;
exports.BlobStorageService = BlobStorageService = BlobStorageService_1 = __decorate([
    (0, common_1.Injectable)()
], BlobStorageService);
//# sourceMappingURL=blob-storage.service.js.map