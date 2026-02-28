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
exports.GlarryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const Express = __importStar(require("express"));
const blob_storage_service_1 = require("../uploads/blob-storage.service");
const glarry_service_1 = require("./glarry.service");
const create_glarry_dto_1 = require("./dto/create-glarry.dto");
const update_glarry_dto_1 = require("./dto/update-glarry.dto");
let GlarryController = class GlarryController {
    constructor(glarryService, blobStorageService) {
        this.glarryService = glarryService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createGlarryDto) {
        if (file) {
            createGlarryDto.photoUrl =
                await this.blobStorageService.uploadGlarryPhoto(file);
        }
        if (!createGlarryDto.photoUrl) {
            throw new common_1.BadRequestException('Either photo file or photoUrl is required');
        }
        const glarry = await this.glarryService.create(createGlarryDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Glarry created successfully',
            data: glarry,
        };
    }
    async findAll(page = '1', limit = '10', projectId) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.glarryService.findAll({
            page: pageNumber,
            limit: limitNumber,
            projectId: projectId ? +projectId : undefined,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Glarry list fetched successfully',
            data: result,
        };
    }
    async findByProject(projectId, page = '1', limit = '10') {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.glarryService.findByProject(+projectId, {
            page: pageNumber,
            limit: limitNumber,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Glarry images by project fetched successfully',
            data: result,
        };
    }
    async findOne(id) {
        const glarry = await this.glarryService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Glarry fetched successfully',
            data: glarry,
        };
    }
    async update(id, file, updateGlarryDto) {
        const payload = { ...updateGlarryDto };
        if (file) {
            payload.photoUrl = await this.blobStorageService.uploadGlarryPhoto(file);
        }
        const glarry = await this.glarryService.update(+id, payload);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Glarry updated successfully',
            data: glarry,
        };
    }
    async remove(id) {
        await this.glarryService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Glarry removed successfully',
        };
    }
};
exports.GlarryController = GlarryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, create_glarry_dto_1.CreateGlarryDto]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object, update_glarry_dto_1.UpdateGlarryDto]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlarryController.prototype, "remove", null);
exports.GlarryController = GlarryController = __decorate([
    (0, common_1.Controller)('glarry'),
    __metadata("design:paramtypes", [glarry_service_1.GlarryService,
        blob_storage_service_1.BlobStorageService])
], GlarryController);
//# sourceMappingURL=glarry.controller.js.map