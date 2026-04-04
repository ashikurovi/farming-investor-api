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
exports.DailyReportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const daily_report_service_1 = require("./daily-report.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_daily_report_dto_1 = require("./dto/create-daily-report.dto");
const update_daily_report_dto_1 = require("./dto/update-daily-report.dto");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
let DailyReportController = class DailyReportController {
    constructor(dailyReportService, blobStorageService) {
        this.dailyReportService = dailyReportService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createDailyReportDto) {
        if (file) {
            createDailyReportDto.photoUrl =
                await this.blobStorageService.uploadProjectImage(file);
        }
        const data = await this.dailyReportService.create(createDailyReportDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Daily report created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.dailyReportService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Daily reports fetched successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.dailyReportService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Daily report fetched successfully',
            data,
        };
    }
    async update(id, updateDailyReportDto) {
        const data = await this.dailyReportService.update(+id, updateDailyReportDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Daily report updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.dailyReportService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Daily report removed successfully',
        };
    }
};
exports.DailyReportController = DailyReportController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_daily_report_dto_1.CreateDailyReportDto]),
    __metadata("design:returntype", Promise)
], DailyReportController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyReportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyReportController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_daily_report_dto_1.UpdateDailyReportDto]),
    __metadata("design:returntype", Promise)
], DailyReportController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyReportController.prototype, "remove", null);
exports.DailyReportController = DailyReportController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('daily-report'),
    __metadata("design:paramtypes", [daily_report_service_1.DailyReportService,
        blob_storage_service_1.BlobStorageService])
], DailyReportController);
//# sourceMappingURL=daily-report.controller.js.map