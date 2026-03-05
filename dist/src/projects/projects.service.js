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
const glarry_entity_1 = require("../glarry/entities/glarry.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ProjectsService = class ProjectsService {
    constructor(projectsRepo, glarryRepo, usersRepo) {
        this.projectsRepo = projectsRepo;
        this.glarryRepo = glarryRepo;
        this.usersRepo = usersRepo;
    }
    async create(createProjectDto) {
        const entity = this.projectsRepo.create(createProjectDto);
        return this.projectsRepo.save(entity);
    }
    async findAll() {
        return this.projectsRepo.find({
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const project = await this.projectsRepo.findOne({
            where: { id },
            relations: ['glarry', 'dailyReports'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id "${id}" not found`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        return this.projectsRepo.manager.transaction(async (manager) => {
            const projRepo = manager.getRepository(project_entity_1.Project);
            const usersRepo = manager.getRepository(user_entity_1.UserEntity);
            const project = await projRepo.findOne({ where: { id } });
            if (!project) {
                throw new common_1.NotFoundException(`Project with id "${id}" not found`);
            }
            const beforeDistributed = Number(project.distributedProfit || 0);
            const merged = projRepo.merge(project, updateProjectDto);
            const saved = await projRepo.save(merged);
            const currentProfit = Number(saved.totalProfit || 0);
            const delta = currentProfit - beforeDistributed;
            if (delta > 0) {
                const users = await usersRepo
                    .createQueryBuilder('u')
                    .leftJoinAndSelect('u.investorType', 'investorType')
                    .where('u.role = :role', { role: user_entity_1.UserRole.INVESTOR })
                    .andWhere('u.isBanned = :banned', { banned: false })
                    .getMany();
                const totalInvest = users.reduce((sum, u) => sum + Number(u.totalInvestment || 0), 0);
                if (users.length > 0 && totalInvest > 0) {
                    for (const u of users) {
                        const share = Number(u.totalInvestment || 0) / totalInvest;
                        const base = delta * share;
                        const investorTypePercent = u.investorType && u.investorType.percentage != null
                            ? Number(u.investorType.percentage)
                            : 100;
                        const pct = investorTypePercent / 100;
                        const final = base * pct;
                        if (final !== 0) {
                            await usersRepo
                                .createQueryBuilder()
                                .update(user_entity_1.UserEntity)
                                .set({
                                totalProfit: () => `"totalProfit" + ${final}`,
                            })
                                .where('id = :id', { id: u.id })
                                .execute();
                        }
                    }
                    await projRepo
                        .createQueryBuilder()
                        .update(project_entity_1.Project)
                        .set({
                        distributedProfit: () => `"distributedProfit" + ${delta}`,
                    })
                        .where('id = :id', { id })
                        .execute();
                }
            }
            return saved;
        });
    }
    async remove(id) {
        const result = await this.projectsRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Project with id "${id}" not found`);
        }
    }
    async getStats() {
        const raw = await this.projectsRepo
            .createQueryBuilder('p')
            .select('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(p.totalInvestment), 0)', 'totalInvestment')
            .addSelect('COALESCE(SUM(p.totalSell), 0)', 'totalSell')
            .addSelect('COALESCE(SUM(p.totalCost), 0)', 'totalCost')
            .addSelect('COALESCE(SUM(p.totalSell - p.totalCost), 0)', 'totalProfit')
            .getRawOne();
        const totalProjects = raw?.count != null ? Number(raw.count) : 0;
        const totalInvestment = raw?.totalInvestment != null ? Number(raw.totalInvestment) : 0;
        const totalSell = raw?.totalSell != null ? Number(raw.totalSell) : 0;
        const totalCost = raw?.totalCost != null ? Number(raw.totalCost) : 0;
        const totalProfit = raw?.totalProfit != null ? Number(raw.totalProfit) : 0;
        const activeInvestors = await this.usersRepo.count({
            where: { role: user_entity_1.UserRole.INVESTOR, isBanned: false },
        });
        const profitTraditional = totalSell - totalCost;
        const avgYieldPercent = totalInvestment > 0 ? (profitTraditional / totalInvestment) * 100 : 0;
        return {
            totalProjects,
            totalInvestment,
            totalSell,
            totalCost,
            totalProfit,
            activeInvestors,
            avgYieldPercent,
        };
    }
    async distributeAllProfit(dto) {
        return this.projectsRepo.manager.transaction(async (manager) => {
            const projRepo = manager.getRepository(project_entity_1.Project);
            const usersRepo = manager.getRepository(user_entity_1.UserEntity);
            const raw = await projRepo
                .createQueryBuilder('p')
                .select('COALESCE(SUM(p.totalProfit), 0)', 'pool')
                .getRawOne();
            const sumProfit = raw?.pool != null ? Number(raw.pool) : 0;
            const pool = dto.amount != null ? Number(dto.amount) : sumProfit;
            if (!isFinite(pool) || pool <= 0) {
                throw new common_1.BadRequestException('Profit pool must be greater than 0');
            }
            const users = await usersRepo
                .createQueryBuilder('u')
                .leftJoinAndSelect('u.investorType', 'investorType')
                .where('u.role = :role', { role: user_entity_1.UserRole.INVESTOR })
                .andWhere('u.isBanned = :banned', { banned: false })
                .getMany();
            if (users.length === 0) {
                throw new common_1.BadRequestException('No eligible investors to distribute profit');
            }
            const totalInvest = users.reduce((sum, u) => sum + Number(u.totalInvestment || 0), 0);
            if (!isFinite(totalInvest) || totalInvest <= 0) {
                throw new common_1.BadRequestException('Total investment across users must be greater than 0');
            }
            const items = [];
            for (const u of users) {
                const share = Number(u.totalInvestment || 0) / totalInvest;
                const base = pool * share;
                const investorTypePercent = u.investorType && u.investorType.percentage != null
                    ? Number(u.investorType.percentage)
                    : 100;
                const pct = investorTypePercent / 100;
                const final = base * pct;
                const withheld = base - final;
                if (final !== 0) {
                    await usersRepo
                        .createQueryBuilder()
                        .update(user_entity_1.UserEntity)
                        .set({
                        totalProfit: () => `"totalProfit" + ${final}`,
                    })
                        .where('id = :id', { id: u.id })
                        .execute();
                }
                items.push({
                    userId: u.id,
                    share,
                    base,
                    investorTypePercent,
                    final,
                    withheld,
                });
            }
            const totalDistributed = items.reduce((s, i) => s + i.final, 0);
            const totalWithheld = items.reduce((s, i) => s + i.withheld, 0);
            return { pool, totalWithheld, totalDistributed, items };
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(glarry_entity_1.GlarryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map