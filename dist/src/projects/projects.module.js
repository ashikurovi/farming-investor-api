"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const projects_service_1 = require("./projects.service");
const projects_controller_1 = require("./projects.controller");
const project_entity_1 = require("./entities/project.entity");
const glarry_entity_1 = require("../glarry/entities/glarry.entity");
const daily_report_entity_1 = require("../daily-report/entities/daily-report.entity");
const user_entity_1 = require("../users/entities/user.entity");
const partner_module_1 = require("../partner/partner.module");
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([project_entity_1.Project, glarry_entity_1.GlarryEntity, daily_report_entity_1.DailyReport, user_entity_1.UserEntity]),
            partner_module_1.PartnerModule,
        ],
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService],
    })
], ProjectsModule);
//# sourceMappingURL=projects.module.js.map