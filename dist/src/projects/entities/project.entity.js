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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectEntity = exports.ProjectStatus = void 0;
const typeorm_1 = require("typeorm");
const investment_entity_1 = require("../../investments/entities/investment.entity");
const project_period_entity_1 = require("../../project-period/entities/project-period.entity");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["OPEN"] = "open";
    ProjectStatus["CLOSED"] = "closed";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
let ProjectEntity = class ProjectEntity {
};
exports.ProjectEntity = ProjectEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProjectEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProjectEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProjectEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProjectEntity.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProjectEntity.prototype, "minInvestmentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProjectEntity.prototype, "collectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProjectEntity.prototype, "profitPercentage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_period_entity_1.ProjectPeriodEntity, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_period_id' }),
    __metadata("design:type", project_period_entity_1.ProjectPeriodEntity)
], ProjectEntity.prototype, "projectPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.OPEN }),
    __metadata("design:type", String)
], ProjectEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], ProjectEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], ProjectEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProjectEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProjectEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => investment_entity_1.InvestmentEntity, (inv) => inv.project),
    __metadata("design:type", Array)
], ProjectEntity.prototype, "investments", void 0);
exports.ProjectEntity = ProjectEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_projects'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['startDate', 'endDate']),
    (0, typeorm_1.Index)(['createdAt'])
], ProjectEntity);
//# sourceMappingURL=project.entity.js.map