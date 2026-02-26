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
let UsersController = class UsersController {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async create(req, file, createUserDto) {
        if (file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            createUserDto.photoUrl = `${baseUrl}/uploads/${file.filename}`;
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
    findOne(id) {
        return this.usersService.findOne(Number(id)).then((user) => ({
            statusCode: common_1.HttpStatus.OK,
            message: 'User fetched successfully',
            data: user,
        }));
    }
    async login(loginUserDto) {
        const result = await this.usersService.login(loginUserDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: result,
        };
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
    async me(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
        }
        const token = authHeader.split(' ')[1];
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const user = await this.usersService.findOne(payload.sub);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User profile fetched successfully',
            data: user,
        };
    }
    async update(id, req, file, updateUserDto) {
        if (file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            updateUserDto.photoUrl = `${baseUrl}/uploads/${file.filename}`;
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
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_user_dto_1.CreateUserDto]),
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
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
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
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, update_user_dto_1.UpdateUserDto]),
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
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], UsersController);
//# sourceMappingURL=users.controller.js.map