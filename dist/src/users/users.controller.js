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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const jwt_1 = require("@nestjs/jwt");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
let UsersController = class UsersController {
    constructor(usersService, jwtService, blobStorageService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createUserDto) {
        if (file) {
            createUserDto.photoUrl =
                await this.blobStorageService.uploadUserPhoto(file);
        }
        const user = await this.usersService.create(createUserDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'User created successfully',
            data: user,
        };
    }
    async findAll(page = '1', limit = '10', search) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.usersService.findAll({
            page: pageNumber,
            limit: limitNumber,
            search,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Users fetched successfully',
            data: result,
        };
    }
    async login(loginUserDto) {
        const result = await this.usersService.login(loginUserDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: result,
        };
    }
    async logout() {
        await this.usersService.logout();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Logout successful',
        };
    }
    async me(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
            }
            const token = authHeader.split(' ')[1];
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.usersService.findOne(payload.sub);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User profile fetched successfully',
                data: user,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    findOne(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            throw new common_1.UnauthorizedException('Invalid user id');
        }
        return this.usersService.findOne(numericId).then((user) => ({
            statusCode: common_1.HttpStatus.OK,
            message: 'User fetched successfully',
            data: user,
        }));
    }
    async forgotPassword(forgotPasswordDto) {
        await this.usersService.forgotPassword(forgotPasswordDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Password reset instructions sent (mock)',
        };
    }
    async resetPassword(resetPasswordDto) {
        await this.usersService.resetPassword(resetPasswordDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Password reset successful',
        };
    }
    async update(id, file, updateUserDto) {
        if (file) {
            updateUserDto.photoUrl =
                await this.blobStorageService.uploadUserPhoto(file);
        }
        const user = await this.usersService.update(Number(id), updateUserDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User updated successfully',
            data: user,
        };
    }
    async ban(id) {
        const user = await this.usersService.ban(Number(id));
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User banned successfully',
            data: user,
        };
    }
    async unban(id) {
        const user = await this.usersService.unban(Number(id));
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User unbanned successfully',
            data: user,
        };
    }
    remove(id) {
        return this.usersService.remove(id).then(() => ({
            statusCode: common_1.HttpStatus.OK,
            message: 'User removed successfully',
        }));
    }
    async withdrawProfit(id) {
        const userId = Number(id);
        const data = await this.usersService.withdrawProfit(userId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Profit withdrawn successfully',
            data,
        };
    }
    async withdrawAll(id) {
        const userId = Number(id);
        const data = await this.usersService.withdrawAll(userId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investment and profit withdrawn successfully',
            data,
        };
    }
    async investments(id, page = '1', limit = '10') {
        const numericId = Number(id);
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const data = await this.usersService.investmentsWithStats(numericId, {
            page: pageNumber,
            limit: limitNumber,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User investments fetched successfully',
            data,
        };
    }
    async payout(id) {
        const numericId = Number(id);
        const data = await this.usersService.payout(numericId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor payout successful',
            data,
        };
    }
    async getAllPayouts() {
        const data = await this.usersService.getAllPayouts();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'All investor payouts fetched successfully',
            data,
        };
    }
    async getPayouts(id) {
        const numericId = Number(id);
        const data = await this.usersService.getPayouts(numericId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor payouts fetched successfully',
            data,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ban", null);
__decorate([
    (0, common_1.Patch)(':id/unban'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unban", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/withdraw-profit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "withdrawProfit", null);
__decorate([
    (0, common_1.Post)(':id/withdraw-all'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "withdrawAll", null);
__decorate([
    (0, common_1.Get)(':id/investments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "investments", null);
__decorate([
    (0, common_1.Post)(':id/payout'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "payout", null);
__decorate([
    (0, common_1.Get)('payouts/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllPayouts", null);
__decorate([
    (0, common_1.Get)(':id/payouts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPayouts", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        blob_storage_service_1.BlobStorageService])
], UsersController);
//# sourceMappingURL=users.controller.js.map