"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestamountModule = void 0;
const common_1 = require("@nestjs/common");
const investamount_service_1 = require("./investamount.service");
const investamount_controller_1 = require("./investamount.controller");
const typeorm_1 = require("@nestjs/typeorm");
const investamount_entity_1 = require("./entities/investamount.entity");
let InvestamountModule = class InvestamountModule {
};
exports.InvestamountModule = InvestamountModule;
exports.InvestamountModule = InvestamountModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([investamount_entity_1.Investamount])],
        controllers: [investamount_controller_1.InvestamountController],
        providers: [investamount_service_1.InvestamountService],
        exports: [investamount_service_1.InvestamountService],
    })
], InvestamountModule);
//# sourceMappingURL=investamount.module.js.map