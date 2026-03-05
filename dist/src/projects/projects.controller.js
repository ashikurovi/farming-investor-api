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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const blob_storage_service_1 = require("../uploads/blob-storage.service");
let ProjectsController = class ProjectsController {
    constructor(projectsService, blobStorageService) {
        this.projectsService = projectsService;
        this.blobStorageService = blobStorageService;
    }
    async create(file, createProjectDto) {
        if (file) {
            createProjectDto.photoUrl =
                await this.blobStorageService.uploadProjectImage(file);
        }
        const data = await this.projectsService.create({
            ...createProjectDto,
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Project created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.projectsService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Projects fetched successfully',
            data,
        };
    }
    async getStats() {
        const data = await this.projectsService.getStats();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project stats fetched successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.projectsService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project fetched successfully',
            data,
        };
    }
    async update(id, file, updateProjectDto) {
        const payload = {
            ...updateProjectDto,
        };
        if (file) {
            payload.photoUrl = await this.blobStorageService.uploadProjectImage(file);
        }
        const data = await this.projectsService.update(+id, payload);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.projectsService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project removed successfully',
        };
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getStats", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        blob_storage_service_1.BlobStorageService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map