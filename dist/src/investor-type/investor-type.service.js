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
exports.InvestorTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investor_type_entity_1 = require("./entities/investor-type.entity");
let InvestorTypeService = class InvestorTypeService {
    constructor(investorTypeRepo) {
        this.investorTypeRepo = investorTypeRepo;
    }
    async create(createInvestorTypeDto) {
        const entity = this.investorTypeRepo.create({
            type: createInvestorTypeDto.type,
            percentage: createInvestorTypeDto.percentage,
        });
        const saved = await this.investorTypeRepo.save(entity);
        return this.findOne(saved.id);
    }
    async findAll() {
        const list = await this.investorTypeRepo.find({
            order: { id: 'DESC' },
        });
        return list.map((i) => this.toResponse(i));
    }
    async findOne(id) {
        const entity = await this.investorTypeRepo.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`InvestorType with id "${id}" not found`);
        }
        return this.toResponse(entity);
    }
    async update(id, updateInvestorTypeDto) {
        const entity = await this.investorTypeRepo.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`InvestorType with id "${id}" not found`);
        }
        if (updateInvestorTypeDto.type != null)
            entity.type = updateInvestorTypeDto.type;
        if (updateInvestorTypeDto.percentage != null)
            entity.percentage = updateInvestorTypeDto.percentage;
        const saved = await this.investorTypeRepo.save(entity);
        return this.toResponse(saved);
    }
    async remove(id) {
        const result = await this.investorTypeRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`InvestorType with id "${id}" not found`);
        }
    }
    toResponse(entity) {
        return {
            id: entity.id,
            type: entity.type,
            percentage: Number(entity.percentage),
        };
    }
};
exports.InvestorTypeService = InvestorTypeService;
exports.InvestorTypeService = InvestorTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investor_type_entity_1.InvestorTypeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvestorTypeService);
//# sourceMappingURL=investor-type.service.js.map