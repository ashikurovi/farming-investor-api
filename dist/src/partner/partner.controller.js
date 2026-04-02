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
exports.PartnerController = void 0;
const common_1 = require("@nestjs/common");
const partner_service_1 = require("./partner.service");
const create_partner_dto_1 = require("./dto/create-partner.dto");
const partner_invest_dto_1 = require("./dto/partner-invest.dto");
const distribute_commission_dto_1 = require("./dto/distribute-commission.dto");
const withdraw_profit_dto_1 = require("./dto/withdraw-profit.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let PartnerController = class PartnerController {
    constructor(partnerService) {
        this.partnerService = partnerService;
    }
    create(createPartnerDto) {
        return this.partnerService.create(createPartnerDto);
    }
    findAll() {
        return this.partnerService.findAll();
    }
    getAllPayouts() {
        return this.partnerService.getAllPayouts();
    }
    findOne(id) {
        return this.partnerService.findOne(+id);
    }
    invest(id, dto) {
        return this.partnerService.invest(+id, dto);
    }
    distributeCommission(dto) {
        return this.partnerService.distributeCommission(dto);
    }
    withdrawProfit(id, dto) {
        return this.partnerService.withdrawProfit(+id, dto);
    }
    getPayouts(id) {
        return this.partnerService.getPayouts(+id);
    }
};
exports.PartnerController = PartnerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('payouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "getAllPayouts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/invest'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PARTNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, partner_invest_dto_1.PartnerInvestDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "invest", null);
__decorate([
    (0, common_1.Post)('commission/distribute'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [distribute_commission_dto_1.DistributeCommissionDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "distributeCommission", null);
__decorate([
    (0, common_1.Post)(':id/withdraw-profit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PARTNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, withdraw_profit_dto_1.WithdrawProfitDto]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "withdrawProfit", null);
__decorate([
    (0, common_1.Get)(':id/payouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PARTNER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnerController.prototype, "getPayouts", null);
exports.PartnerController = PartnerController = __decorate([
    (0, common_1.Controller)('partner'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService])
], PartnerController);
//# sourceMappingURL=partner.controller.js.map