"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentModule = void 0;
const common_1 = require("@nestjs/common");
const investment_service_1 = require("./investment.service");
const investment_controller_1 = require("./investment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const investment_entity_1 = require("./entities/investment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const investamount_module_1 = require("../investamount/investamount.module");
let InvestmentModule = class InvestmentModule {
};
exports.InvestmentModule = InvestmentModule;
exports.InvestmentModule = InvestmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([investment_entity_1.Investment, user_entity_1.UserEntity]),
            users_module_1.UsersModule,
            investamount_module_1.InvestamountModule,
        ],
        controllers: [investment_controller_1.InvestmentController],
        providers: [investment_service_1.InvestmentService],
        exports: [investment_service_1.InvestmentService],
    })
], InvestmentModule);
//# sourceMappingURL=investment.module.js.map