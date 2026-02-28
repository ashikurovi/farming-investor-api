"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPeriodModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_period_service_1 = require("./project-period.service");
const project_period_controller_1 = require("./project-period.controller");
const project_period_entity_1 = require("./entities/project-period.entity");
let ProjectPeriodModule = class ProjectPeriodModule {
};
exports.ProjectPeriodModule = ProjectPeriodModule;
exports.ProjectPeriodModule = ProjectPeriodModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_period_entity_1.ProjectPeriodEntity])],
        controllers: [project_period_controller_1.ProjectPeriodController],
        providers: [project_period_service_1.ProjectPeriodService],
        exports: [project_period_service_1.ProjectPeriodService],
    })
], ProjectPeriodModule);
//# sourceMappingURL=project-period.module.js.map