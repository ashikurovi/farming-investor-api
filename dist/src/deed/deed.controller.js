"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeedController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const deed_service_1 = require("./deed.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_deed_dto_1 = require("./dto/create-deed.dto");
const update_deed_dto_1 = require("./dto/update-deed.dto");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
let DeedController = class DeedController {
    constructor(deedService, blobStorageService) {
        this.deedService = deedService;
        this.blobStorageService = blobStorageService;
    }
    async create(files, createDeedDto) {
        if (files?.file?.[0]) {
            createDeedDto.file = await this.blobStorageService.uploadDeedFile(files.file[0]);
        }
        if (files?.uploadPdf?.[0]) {
            createDeedDto.uploadPdf = await this.blobStorageService.uploadDeedFile(files.uploadPdf[0]);
        }
        if (files?.signature?.[0]) {
            createDeedDto.signature = await this.blobStorageService.uploadDeedFile(files.signature[0]);
        }
        if (createDeedDto.investmentId) {
            createDeedDto.investmentId = Number(createDeedDto.investmentId);
        }
        const deed = await this.deedService.create(createDeedDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Deed created successfully',
            data: deed,
        };
    }
    async findAll(page = '1', limit = '10', search) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.deedService.findAll({
            page: pageNumber,
            limit: limitNumber,
            search,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Deeds fetched successfully',
            data: result,
        };
    }
    async findOne(id) {
        const deed = await this.deedService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Deed fetched successfully',
            data: deed,
        };
    }
    async update(id, files, updateDeedDto) {
        const payload = { ...updateDeedDto };
        if (files?.file?.[0]) {
            payload.file = await this.blobStorageService.uploadDeedFile(files.file[0]);
        }
        if (files?.uploadPdf?.[0]) {
            payload.uploadPdf = await this.blobStorageService.uploadDeedFile(files.uploadPdf[0]);
        }
        if (files?.signature?.[0]) {
            payload.signature = await this.blobStorageService.uploadDeedFile(files.signature[0]);
        }
        if (payload.investmentId) {
            payload.investmentId = Number(payload.investmentId);
        }
        const deed = await this.deedService.update(+id, payload);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Deed updated successfully',
            data: deed,
        };
    }
    async remove(id) {
        await this.deedService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Deed removed successfully',
        };
    }
};
exports.DeedController = DeedController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'uploadPdf', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_deed_dto_1.CreateDeedDto]),
    __metadata("design:returntype", Promise)
], DeedController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], DeedController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeedController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'uploadPdf', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_deed_dto_1.UpdateDeedDto]),
    __metadata("design:returntype", Promise)
], DeedController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeedController.prototype, "remove", null);
exports.DeedController = DeedController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('deed'),
    __metadata("design:paramtypes", [deed_service_1.DeedService,
        blob_storage_service_1.BlobStorageService])
], DeedController);
//# sourceMappingURL=deed.controller.js.map