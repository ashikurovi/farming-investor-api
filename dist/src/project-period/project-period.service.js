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
exports.ProjectPeriodService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_period_entity_1 = require("./entities/project-period.entity");
let ProjectPeriodService = class ProjectPeriodService {
    constructor(projectPeriodRepository) {
        this.projectPeriodRepository = projectPeriodRepository;
    }
    async create(createProjectPeriodDto) {
        const period = this.projectPeriodRepository.create(createProjectPeriodDto);
        return this.projectPeriodRepository.save(period);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.projectPeriodRepository.createQueryBuilder('project_period');
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('project_period.duration LIKE :search', {
                search: likeSearch,
            });
        }
        queryBuilder
            .orderBy('project_period.startDate', 'DESC')
            .addOrderBy('project_period.id', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items,
            meta: {
                total,
                page,
                limit: safeLimit,
                pageCount,
            },
        };
    }
    async findOne(id) {
        const period = await this.projectPeriodRepository.findOne({
            where: { id },
        });
        if (!period) {
            throw new common_1.NotFoundException(`Project period with id "${id}" not found`);
        }
        return period;
    }
    async update(id, updateProjectPeriodDto) {
        const period = await this.findOne(id);
        const merged = this.projectPeriodRepository.merge(period, updateProjectPeriodDto);
        return this.projectPeriodRepository.save(merged);
    }
    async remove(id) {
        const result = await this.projectPeriodRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Project period with id "${id}" not found`);
        }
    }
};
exports.ProjectPeriodService = ProjectPeriodService;
exports.ProjectPeriodService = ProjectPeriodService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_period_entity_1.ProjectPeriodEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectPeriodService);
//# sourceMappingURL=project-period.service.js.map