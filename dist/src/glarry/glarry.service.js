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
exports.GlarryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const glarry_entity_1 = require("./entities/glarry.entity");
let GlarryService = class GlarryService {
    constructor(glarryRepo) {
        this.glarryRepo = glarryRepo;
    }
    async create(createGlarryDto) {
        const glarry = this.glarryRepo.create({
            projectId: createGlarryDto.projectId,
            photoUrl: createGlarryDto.photoUrl,
        });
        const saved = await this.glarryRepo.save(glarry);
        return this.findOne(saved.id);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, projectId } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const qb = this.glarryRepo
            .createQueryBuilder('glarry')
            .leftJoinAndSelect('glarry.project', 'project')
            .orderBy('glarry.id', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        if (projectId != null) {
            qb.where('glarry.project_id = :projectId', { projectId });
        }
        const [list, total] = await qb.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items: list.map((g) => this.toResponse(g)),
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async findByProject(projectId, options = {}) {
        const { page = 1, limit = 10 } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const qb = this.glarryRepo
            .createQueryBuilder('glarry')
            .leftJoinAndSelect('glarry.project', 'project')
            .orderBy('glarry.id', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit)
            .where('glarry.project_id = :projectId', { projectId });
        const [list, total] = await qb.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items: list.map((g) => this.toResponse(g)),
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async findOne(id) {
        const glarry = await this.glarryRepo.findOne({
            where: { id },
            relations: ['project'],
        });
        if (!glarry) {
            throw new common_1.NotFoundException(`Glarry with id "${id}" not found`);
        }
        return this.toResponse(glarry);
    }
    async update(id, updateGlarryDto) {
        const glarry = await this.glarryRepo.findOne({ where: { id } });
        if (!glarry) {
            throw new common_1.NotFoundException(`Glarry with id "${id}" not found`);
        }
        if (updateGlarryDto.projectId != null) {
            glarry.projectId = updateGlarryDto.projectId;
        }
        if (updateGlarryDto.photoUrl != null)
            glarry.photoUrl = updateGlarryDto.photoUrl;
        const saved = await this.glarryRepo.save(glarry);
        return this.toResponse(saved);
    }
    async remove(id) {
        const result = await this.glarryRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Glarry with id "${id}" not found`);
        }
    }
    toResponse(g) {
        return {
            id: g.id,
            projectId: g.projectId,
            photoUrl: g.photoUrl,
            projectName: g.project?.name,
        };
    }
};
exports.GlarryService = GlarryService;
exports.GlarryService = GlarryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(glarry_entity_1.GlarryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GlarryService);
//# sourceMappingURL=glarry.service.js.map