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
exports.InvestorTypeController = void 0;
const common_1 = require("@nestjs/common");
const investor_type_service_1 = require("./investor-type.service");
const create_investor_type_dto_1 = require("./dto/create-investor-type.dto");
const update_investor_type_dto_1 = require("./dto/update-investor-type.dto");
let InvestorTypeController = class InvestorTypeController {
    constructor(investorTypeService) {
        this.investorTypeService = investorTypeService;
    }
    async create(createInvestorTypeDto) {
        const data = await this.investorTypeService.create(createInvestorTypeDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Investor type created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.investorTypeService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor types fetched successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.investorTypeService.findOne(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor type fetched successfully',
            data,
        };
    }
    async update(id, updateInvestorTypeDto) {
        const data = await this.investorTypeService.update(+id, updateInvestorTypeDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor type updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.investorTypeService.remove(+id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor type removed successfully',
        };
    }
};
exports.InvestorTypeController = InvestorTypeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_type_dto_1.CreateInvestorTypeDto]),
    __metadata("design:returntype", Promise)
], InvestorTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestorTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investor_type_dto_1.UpdateInvestorTypeDto]),
    __metadata("design:returntype", Promise)
], InvestorTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorTypeController.prototype, "remove", null);
exports.InvestorTypeController = InvestorTypeController = __decorate([
    (0, common_1.Controller)('investor-types'),
    __metadata("design:paramtypes", [investor_type_service_1.InvestorTypeService])
], InvestorTypeController);
//# sourceMappingURL=investor-type.controller.js.map