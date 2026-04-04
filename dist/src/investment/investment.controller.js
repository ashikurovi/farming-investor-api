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
exports.InvestmentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const investment_service_1 = require("./investment.service");
const create_investment_dto_1 = require("./dto/create-investment.dto");
const update_investment_dto_1 = require("./dto/update-investment.dto");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
const users_service_1 = require("../users/users.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
let InvestmentController = class InvestmentController {
    constructor(investmentService, usersService, blobStorageService) {
        this.investmentService = investmentService;
        this.usersService = usersService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createInvestmentDto) {
        if (file) {
            createInvestmentDto.photoUrl =
                await this.blobStorageService.uploadUserPhoto(file);
        }
        const data = await this.investmentService.create(createInvestmentDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Investment created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.investmentService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investments fetched successfully',
            data,
        };
    }
    async my(userId, page = '1', limit = '10') {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const data = await this.usersService.investmentsWithStats(userId, {
            page: pageNumber,
            limit: limitNumber,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'My investments fetched successfully',
            data,
        };
    }
    async getStats() {
        const data = await this.investmentService.stats();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investment stats fetched successfully',
            data,
        };
    }
    async recent() {
        const data = await this.investmentService.findRecent(5);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Recent investments fetched successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.investmentService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investment fetched successfully',
            data,
        };
    }
    async update(id, file, updateInvestmentDto) {
        if (file) {
            updateInvestmentDto.photoUrl =
                await this.blobStorageService.uploadUserPhoto(file);
        }
        const data = await this.investmentService.update(+id, updateInvestmentDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investment updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.investmentService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investment removed successfully',
        };
    }
};
exports.InvestmentController = InvestmentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_investment_dto_1.CreateInvestmentDto]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "my", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "recent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_investment_dto_1.UpdateInvestmentDto]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "remove", null);
exports.InvestmentController = InvestmentController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(['investment', 'investments']),
    __metadata("design:paramtypes", [investment_service_1.InvestmentService,
        users_service_1.UsersService,
        blob_storage_service_1.BlobStorageService])
], InvestmentController);
//# sourceMappingURL=investment.controller.js.map