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
exports.InvestmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investment_entity_1 = require("./entities/investment.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const projects_service_1 = require("../projects/projects.service");
const user_entity_1 = require("../users/entities/user.entity");
let InvestmentsService = class InvestmentsService {
    constructor(investmentRepository, projectRepository, userRepository, projectsService) {
        this.investmentRepository = investmentRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectsService = projectsService;
    }
    async invest(userId, createInvestmentDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id "${userId}" not found`);
        }
        const project = await this.projectRepository.findOne({
            where: { id: createInvestmentDto.projectId },
            select: ['id', 'totalPrice', 'collectedAmount', 'status', 'minInvestmentAmount'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${createInvestmentDto.projectId}" not found`);
        }
        if (project.status === project_entity_1.ProjectStatus.CLOSED) {
            throw new common_1.BadRequestException('Cannot invest in a closed project');
        }
        const amount = Number(createInvestmentDto.amount);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Investment amount must be greater than 0');
        }
        const minAmount = Number(project.minInvestmentAmount ?? 0);
        if (minAmount > 0 && amount < minAmount) {
            throw new common_1.BadRequestException(`Minimum investment for this project is ${minAmount}. You invested ${amount}.`);
        }
        const remainingAmount = Number(project.totalPrice) - Number(project.collectedAmount);
        if (amount > remainingAmount) {
            throw new common_1.BadRequestException(`Investment amount cannot exceed remaining amount (${remainingAmount})`);
        }
        const projectId = createInvestmentDto.projectId;
        let investment = await this.investmentRepository.findOne({
            where: { userId, projectId },
        });
        if (investment) {
            const previousAmount = Number(investment.amount);
            investment.amount = previousAmount + amount;
            await this.investmentRepository.save(investment);
        }
        else {
            investment = this.investmentRepository.create({
                userId,
                projectId,
                amount,
            });
            await this.investmentRepository.save(investment);
        }
        await this.projectsService.incrementCollectedAmount(projectId, amount);
        return this.investmentRepository.findOne({
            where: { id: investment.id },
            relations: ['project', 'user'],
        });
    }
    async findAllByUser(userId, options = {}) {
        const { page = 1, limit = 10, search } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.investmentRepository
            .createQueryBuilder('investment')
            .leftJoinAndSelect('investment.project', 'project')
            .leftJoinAndSelect('investment.user', 'user')
            .where('investment.userId = :userId', { userId });
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(project.title ILIKE :search OR project.description ILIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('investment.createdAt', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items,
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async findAllByProject(projectId, options = {}) {
        await this.projectsService.findOne(projectId);
        const { page = 1, limit = 10, search } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.investmentRepository
            .createQueryBuilder('investment')
            .leftJoinAndSelect('investment.user', 'user')
            .leftJoinAndSelect('investment.project', 'project')
            .where('investment.projectId = :projectId', { projectId });
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('investment.createdAt', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items,
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async getInvestorsByProject(projectId, options = {}) {
        await this.projectsService.getInvestmentInfo(projectId);
        const { page = 1, limit = 10, search } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.investmentRepository
            .createQueryBuilder('investment')
            .innerJoinAndSelect('investment.user', 'user')
            .where('investment.projectId = :projectId', { projectId })
            .select([
            'investment.id',
            'investment.userId',
            'investment.amount',
            'user.id',
            'user.name',
            'user.email',
            'user.phone',
        ]);
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('investment.amount', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        const investors = items.map((inv) => ({
            userId: inv.userId,
            name: inv.user?.name ?? '',
            email: inv.user?.email ?? '',
            phone: inv.user?.phone ?? '',
            amount: Number(inv.amount),
        }));
        return {
            investors,
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search, projectId, userId } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.investmentRepository
            .createQueryBuilder('investment')
            .leftJoinAndSelect('investment.project', 'project')
            .leftJoinAndSelect('investment.user', 'user');
        if (projectId != null) {
            queryBuilder.andWhere('investment.projectId = :projectId', { projectId });
        }
        if (userId != null) {
            queryBuilder.andWhere('investment.userId = :userId', { userId });
        }
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(project.title ILIKE :search OR project.description ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('investment.createdAt', 'DESC')
            .skip((page - 1) * safeLimit)
            .take(safeLimit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;
        return {
            items,
            meta: { total, page, limit: safeLimit, pageCount },
        };
    }
    async getStats() {
        const [totalInvestments, totalAmountResult, uniqueInvestors, uniqueProjects] = await Promise.all([
            this.investmentRepository.count(),
            this.investmentRepository
                .createQueryBuilder('i')
                .select('COALESCE(SUM(CAST(i.amount AS DECIMAL)), 0)', 'total')
                .getRawOne(),
            this.investmentRepository
                .createQueryBuilder('i')
                .select('COUNT(DISTINCT i.userId)', 'count')
                .getRawOne(),
            this.investmentRepository
                .createQueryBuilder('i')
                .select('COUNT(DISTINCT i.projectId)', 'count')
                .getRawOne(),
        ]);
        return {
            totalInvestments,
            totalAmountInvested: Number(totalAmountResult?.total ?? 0),
            uniqueInvestors: Number(uniqueInvestors?.count ?? 0),
            uniqueProjectsInvested: Number(uniqueProjects?.count ?? 0),
        };
    }
    async findOne(id) {
        const investment = await this.investmentRepository.findOne({
            where: { id },
            relations: ['project', 'user'],
        });
        if (!investment) {
            throw new common_1.NotFoundException(`Investment with id "${id}" not found`);
        }
        return investment;
    }
    async remove(id, userId) {
        const investment = await this.investmentRepository.findOne({
            where: { id },
        });
        if (!investment) {
            throw new common_1.NotFoundException(`Investment with id "${id}" not found`);
        }
        if (userId != null && investment.userId !== userId) {
            throw new common_1.NotFoundException(`Investment with id "${id}" not found`);
        }
        const amount = Number(investment.amount);
        const projectId = investment.projectId;
        await this.investmentRepository.remove(investment);
        await this.projectsService.decrementCollectedAmount(projectId, amount);
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investment_entity_1.InvestmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        projects_service_1.ProjectsService])
], InvestmentsService);
//# sourceMappingURL=investments.service.js.map