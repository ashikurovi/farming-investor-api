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
exports.ProjectPeriodController = void 0;
const common_1 = require("@nestjs/common");
const project_period_service_1 = require("./project-period.service");
const create_project_period_dto_1 = require("./dto/create-project-period.dto");
const update_project_period_dto_1 = require("./dto/update-project-period.dto");
let ProjectPeriodController = class ProjectPeriodController {
    constructor(projectPeriodService) {
        this.projectPeriodService = projectPeriodService;
    }
    async create(createProjectPeriodDto) {
        const period = await this.projectPeriodService.create(createProjectPeriodDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Project period created successfully',
            data: period,
        };
    }
    async findAll(page = '1', limit = '10', search) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
        const result = await this.projectPeriodService.findAll({
            page: pageNumber,
            limit: limitNumber,
            search,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project periods fetched successfully',
            data: result,
        };
    }
    async findOne(id) {
        const period = await this.projectPeriodService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project period fetched successfully',
            data: period,
        };
    }
    async update(id, updateProjectPeriodDto) {
        const period = await this.projectPeriodService.update(+id, updateProjectPeriodDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project period updated successfully',
            data: period,
        };
    }
    async remove(id) {
        await this.projectPeriodService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Project period removed successfully',
        };
    }
};
exports.ProjectPeriodController = ProjectPeriodController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_period_dto_1.CreateProjectPeriodDto]),
    __metadata("design:returntype", Promise)
], ProjectPeriodController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProjectPeriodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectPeriodController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_period_dto_1.UpdateProjectPeriodDto]),
    __metadata("design:returntype", Promise)
], ProjectPeriodController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectPeriodController.prototype, "remove", null);
exports.ProjectPeriodController = ProjectPeriodController = __decorate([
    (0, common_1.Controller)('project-period'),
    __metadata("design:paramtypes", [project_period_service_1.ProjectPeriodService])
], ProjectPeriodController);
//# sourceMappingURL=project-period.controller.js.map