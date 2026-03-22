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
exports.NoticeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
const notice_service_1 = require("./notice.service");
const create_notice_dto_1 = require("./dto/create-notice.dto");
const update_notice_dto_1 = require("./dto/update-notice.dto");
let NoticeController = class NoticeController {
    constructor(noticeService, blobStorageService) {
        this.noticeService = noticeService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createNoticeDto) {
        if (file) {
            createNoticeDto.fileUrl = await this.blobStorageService.uploadNoticeFile(file);
        }
        const notice = await this.noticeService.create(createNoticeDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Notice created successfully',
            data: notice,
        };
    }
    async findAll(page = '1', limit = '10', search) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.noticeService.findAll({
            page: pageNumber,
            limit: limitNumber,
            search,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notices fetched successfully',
            data: result,
        };
    }
    async findOne(id) {
        const notice = await this.noticeService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice fetched successfully',
            data: notice,
        };
    }
    async update(id, file, updateNoticeDto) {
        const payload = {
            ...updateNoticeDto,
        };
        if (file) {
            payload.fileUrl = await this.blobStorageService.uploadNoticeFile(file);
        }
        const notice = await this.noticeService.update(+id, payload);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice updated successfully',
            data: notice,
        };
    }
    async remove(id) {
        await this.noticeService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice removed successfully',
        };
    }
};
exports.NoticeController = NoticeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_notice_dto_1.CreateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_notice_dto_1.UpdateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "remove", null);
exports.NoticeController = NoticeController = __decorate([
    (0, common_1.Controller)('notice'),
    __metadata("design:paramtypes", [notice_service_1.NoticeService,
        blob_storage_service_1.BlobStorageService])
], NoticeController);
//# sourceMappingURL=notice.controller.js.map