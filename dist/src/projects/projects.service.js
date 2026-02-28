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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const project_period_service_1 = require("../project-period/project-period.service");
const investment_entity_1 = require("../investments/entities/investment.entity");
let ProjectsService = class ProjectsService {
    constructor(projectRepository, investmentRepository, projectPeriodService) {
        this.projectRepository = projectRepository;
        this.investmentRepository = investmentRepository;
        this.projectPeriodService = projectPeriodService;
    }
    async create(createProjectDto) {
        const { projectPeriodId, ...rest } = createProjectDto;
        const projectPeriod = await this.projectPeriodService.findOne(projectPeriodId);
        const project = this.projectRepository.create({
            ...rest,
            projectPeriod,
            collectedAmount: 0,
            status: project_entity_1.ProjectStatus.OPEN,
            minInvestmentAmount: rest.minInvestmentAmount ?? 0,
        });
        return this.projectRepository.save(project);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search, status } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.projectRepository.createQueryBuilder('project');
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(project.title LIKE :search OR project.description LIKE :search)', { search: likeSearch });
        }
        if (status) {
            queryBuilder.andWhere('project.status = :status', { status });
        }
        queryBuilder
            .leftJoinAndSelect('project.projectPeriod', 'projectPeriod')
            .orderBy('project.createdAt', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items,
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async findOne(id, loadInvestments = true) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: loadInvestments
                ? ['investments', 'projectPeriod']
                : ['projectPeriod'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${id}" not found`);
        }
        return project;
    }
    async findOneForUpdate(id) {
        const project = await this.projectRepository.findOne({ where: { id } });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${id}" not found`);
        }
        return project;
    }
    async getGlobalStats() {
        const [openCount, closedCount] = await Promise.all([
            this.projectRepository.count({ where: { status: project_entity_1.ProjectStatus.OPEN } }),
            this.projectRepository.count({ where: { status: project_entity_1.ProjectStatus.CLOSED } }),
        ]);
        const sums = await this.projectRepository
            .createQueryBuilder('p')
            .select('COALESCE(SUM(CAST(p.totalPrice AS DECIMAL)), 0)', 'totalTarget')
            .addSelect('COALESCE(SUM(CAST(p.collectedAmount AS DECIMAL)), 0)', 'totalCollected')
            .getRawOne();
        const investorResult = await this.investmentRepository
            .createQueryBuilder('i')
            .select('COUNT(DISTINCT i.user_id)', 'count')
            .getRawOne();
        const totalTarget = Number(sums?.totalTarget ?? 0);
        const totalCollected = Number(sums?.totalCollected ?? 0);
        return {
            totalProjects: openCount + closedCount,
            openProjects: openCount,
            closedProjects: closedCount,
            totalTargetAmount: totalTarget,
            totalCollectedAmount: totalCollected,
            totalRemainingAmount: Math.max(0, totalTarget - totalCollected),
            totalInvestors: Number(investorResult?.count ?? 0),
        };
    }
    async getProjectStats(projectId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            select: ['id', 'title', 'status', 'totalPrice', 'collectedAmount'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" not found`);
        }
        const investorResult = await this.investmentRepository
            .createQueryBuilder('i')
            .where('i.project_id = :projectId', { projectId })
            .select('COUNT(DISTINCT i.user_id)', 'count')
            .getRawOne();
        const total = Number(project.totalPrice);
        const collected = Number(project.collectedAmount);
        const remaining = Math.max(0, total - collected);
        const progressPercent = total > 0 ? Math.min(100, (collected / total) * 100) : 0;
        return {
            projectId: project.id,
            title: project.title,
            status: project.status,
            totalTargetAmount: total,
            collectedAmount: collected,
            remainingAmount: remaining,
            progressPercent: Math.round(progressPercent * 100) / 100,
            investorCount: Number(investorResult?.count ?? 0),
        };
    }
    async getInvestmentInfo(projectId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            select: ['id', 'minInvestmentAmount', 'totalPrice', 'collectedAmount', 'status'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" not found`);
        }
        const total = Number(project.totalPrice);
        const collected = Number(project.collectedAmount);
        return {
            projectId: project.id,
            minInvestmentAmount: Number(project.minInvestmentAmount ?? 0),
            totalPrice: total,
            collectedAmount: collected,
            remainingAmount: Math.max(0, total - collected),
            status: project.status,
        };
    }
    async update(id, updateProjectDto) {
        const project = await this.findOne(id, false);
        const { projectPeriodId, ...rest } = updateProjectDto;
        const payload = projectPeriodId
            ? { ...rest, projectPeriod: { id: projectPeriodId } }
            : rest;
        const merged = this.projectRepository.merge(project, payload);
        return this.projectRepository.save(merged);
    }
    async remove(id) {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Project with id "${id}" not found`);
        }
    }
    async incrementCollectedAmount(projectId, amount) {
        const project = await this.findOneForUpdate(projectId);
        const newCollected = Number(project.collectedAmount) + Number(amount);
        project.collectedAmount = newCollected;
        if (newCollected >= Number(project.totalPrice)) {
            project.status = project_entity_1.ProjectStatus.CLOSED;
        }
        return this.projectRepository.save(project);
    }
    async decrementCollectedAmount(projectId, amount) {
        const project = await this.findOneForUpdate(projectId);
        const newCollected = Math.max(0, Number(project.collectedAmount) - Number(amount));
        project.collectedAmount = newCollected;
        if (newCollected < Number(project.totalPrice)) {
            project.status = project_entity_1.ProjectStatus.OPEN;
        }
        return this.projectRepository.save(project);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(investment_entity_1.InvestmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        project_period_service_1.ProjectPeriodService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map