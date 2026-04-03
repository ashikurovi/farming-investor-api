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
exports.DeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deed_entity_1 = require("./entities/deed.entity");
let DeedService = class DeedService {
    constructor(deedRepository) {
        this.deedRepository = deedRepository;
    }
    async create(createDeedDto) {
        const deed = this.deedRepository.create(createDeedDto);
        return await this.deedRepository.save(deed);
    }
    async findAll({ page = 1, limit = 10, search = '' }) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.deedRepository.createQueryBuilder('deed')
            .leftJoinAndSelect('deed.investment', 'investment')
            .leftJoinAndSelect('investment.investor', 'investor')
            .orderBy('deed.createdAt', 'DESC');
        if (search) {
            queryBuilder.where('deed.title ILIKE :search OR investor.name ILIKE :search OR investor.email ILIKE :search', { search: `%${search}%` });
        }
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                totalItems: total,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    }
    async findOne(id) {
        const deed = await this.deedRepository.findOne({
            where: { id },
            relations: ['investment']
        });
        if (!deed) {
            throw new common_1.NotFoundException(`Deed with ID ${id} not found`);
        }
        return deed;
    }
    async update(id, updateDeedDto) {
        const deed = await this.findOne(id);
        this.deedRepository.merge(deed, updateDeedDto);
        return await this.deedRepository.save(deed);
    }
    async remove(id) {
        const deed = await this.findOne(id);
        return await this.deedRepository.remove(deed);
    }
};
exports.DeedService = DeedService;
exports.DeedService = DeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deed_entity_1.Deed)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeedService);
//# sourceMappingURL=deed.service.js.map