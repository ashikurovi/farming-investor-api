"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_report_service_1 = require("./daily-report.service");
const daily_report_controller_1 = require("./daily-report.controller");
const daily_report_entity_1 = require("./entities/daily-report.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const user_entity_1 = require("../users/entities/user.entity");
const investment_module_1 = require("../investment/investment.module");
const partner_module_1 = require("../partner/partner.module");
let DailyReportModule = class DailyReportModule {
};
exports.DailyReportModule = DailyReportModule;
exports.DailyReportModule = DailyReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([daily_report_entity_1.DailyReport, project_entity_1.Project, user_entity_1.UserEntity]),
            investment_module_1.InvestmentModule,
            partner_module_1.PartnerModule,
        ],
        controllers: [daily_report_controller_1.DailyReportController],
        providers: [daily_report_service_1.DailyReportService],
    })
], DailyReportModule);
//# sourceMappingURL=daily-report.module.js.map