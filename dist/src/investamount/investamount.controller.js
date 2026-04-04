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
exports.InvestamountController = void 0;
const common_1 = require("@nestjs/common");
const investamount_service_1 = require("./investamount.service");
const update_investamount_dto_1 = require("./dto/update-investamount.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let InvestamountController = class InvestamountController {
    constructor(investamountService) {
        this.investamountService = investamountService;
    }
    findFirst() {
        return this.investamountService.findFirst();
    }
    update(updateInvestamountDto) {
        return this.investamountService.update(updateInvestamountDto);
    }
};
exports.InvestamountController = InvestamountController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestamountController.prototype, "findFirst", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_investamount_dto_1.UpdateInvestamountDto]),
    __metadata("design:returntype", void 0)
], InvestamountController.prototype, "update", null);
exports.InvestamountController = InvestamountController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('investamount'),
    __metadata("design:paramtypes", [investamount_service_1.InvestamountService])
], InvestamountController);
//# sourceMappingURL=investamount.controller.js.map