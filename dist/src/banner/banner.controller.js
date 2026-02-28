"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const Express = __importStar(require("express"));
const blob_storage_service_1 = require("../uploads/blob-storage.service");
const banner_service_1 = require("./banner.service");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
let BannerController = class BannerController {
    constructor(bannerService, blobStorageService) {
        this.bannerService = bannerService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createBannerDto) {
        if (file) {
            createBannerDto.photoUrl =
                await this.blobStorageService.uploadBannerPhoto(file);
        }
        const banner = await this.bannerService.create(createBannerDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Banner created successfully',
            data: banner,
        };
    }
    async findAll(page = '1', limit = '10', search) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.bannerService.findAll({
            page: pageNumber,
            limit: limitNumber,
            search,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Banners fetched successfully',
            data: result,
        };
    }
    async findOne(id) {
        const banner = await this.bannerService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Banner fetched successfully',
            data: banner,
        };
    }
    async update(id, file, updateBannerDto) {
        const payload = {
            ...updateBannerDto,
        };
        if (file) {
            payload.photoUrl =
                await this.blobStorageService.uploadBannerPhoto(file);
        }
        const banner = await this.bannerService.update(+id, payload);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Banner updated successfully',
            data: banner,
        };
    }
    async remove(id) {
        await this.bannerService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Banner removed successfully',
        };
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, create_banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object, update_banner_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "remove", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)('banner'),
    __metadata("design:paramtypes", [banner_service_1.BannerService,
        blob_storage_service_1.BlobStorageService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map