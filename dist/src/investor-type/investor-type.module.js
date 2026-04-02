"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorTypeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const investor_type_service_1 = require("./investor-type.service");
const investor_type_controller_1 = require("./investor-type.controller");
const investor_type_entity_1 = require("./entities/investor-type.entity");
const partner_module_1 = require("../partner/partner.module");
let InvestorTypeModule = class InvestorTypeModule {
};
exports.InvestorTypeModule = InvestorTypeModule;
exports.InvestorTypeModule = InvestorTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([investor_type_entity_1.InvestorTypeEntity]), partner_module_1.PartnerModule],
        controllers: [investor_type_controller_1.InvestorTypeController],
        providers: [investor_type_service_1.InvestorTypeService],
    })
], InvestorTypeModule);
//# sourceMappingURL=investor-type.module.js.map