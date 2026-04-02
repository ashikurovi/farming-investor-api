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
exports.DailyReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_report_entity_1 = require("./entities/daily-report.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const user_entity_1 = require("../users/entities/user.entity");
const investment_service_1 = require("../investment/investment.service");
const partner_service_1 = require("../partner/partner.service");
let DailyReportService = class DailyReportService {
    constructor(dailyReportRepo, projectsRepo, usersRepo, investmentService, partnerService) {
        this.dailyReportRepo = dailyReportRepo;
        this.projectsRepo = projectsRepo;
        this.usersRepo = usersRepo;
        this.investmentService = investmentService;
        this.partnerService = partnerService;
    }
    async create(dto) {
        await this.investmentService.refreshInvestmentStatuses();
        return this.dailyReportRepo.manager.transaction(async (manager) => {
            const projRepo = manager.getRepository(project_entity_1.Project);
            const reportRepo = manager.getRepository(daily_report_entity_1.DailyReport);
            const project = await projRepo.findOne({ where: { id: dto.projectId } });
            if (!project) {
                throw new common_1.NotFoundException(`Project with id "${dto.projectId}" not found`);
            }
            const entity = reportRepo.create(dto);
            const saved = await reportRepo.save(entity);
            if (dto.dailyCost && Number(dto.dailyCost) !== 0) {
                const dailyCostNum = Number(dto.dailyCost);
                await projRepo.increment({ id: dto.projectId }, 'totalCost', dailyCostNum);
                await projRepo.increment({ id: dto.projectId }, 'totalInvestment', dailyCostNum);
                const eligibleUsers = await this.usersRepo
                    .createQueryBuilder('u')
                    .where('u.role = :role', { role: user_entity_1.UserRole.INVESTOR })
                    .andWhere('u.isBanned = :banned', { banned: false })
                    .andWhere('u.balance > 0')
                    .andWhere('u.totalInvestment > 0')
                    .getMany();
                const eligibleCount = eligibleUsers.length;
                if (eligibleCount > 0) {
                    const perUser = dailyCostNum / eligibleCount;
                    for (const u of eligibleUsers) {
                        const currentBalance = Number(u.balance || 0);
                        if (currentBalance <= 0) {
                            continue;
                        }
                        const deduction = Math.min(currentBalance, perUser);
                        if (deduction <= 0) {
                            continue;
                        }
                        await this.usersRepo
                            .createQueryBuilder()
                            .update(user_entity_1.UserEntity)
                            .set({
                            balance: () => `"balance" - ${deduction}`,
                            totalCost: () => `"totalCost" + ${deduction}`,
                        })
                            .where('id = :id', { id: u.id })
                            .andWhere('balance > 0')
                            .execute();
                    }
                }
            }
            if (dto.dailySell && Number(dto.dailySell) !== 0) {
                await projRepo.increment({ id: dto.projectId }, 'totalSell', Number(dto.dailySell));
            }
            await projRepo
                .createQueryBuilder()
                .update(project_entity_1.Project)
                .set({
                totalProfit: () => 'CASE WHEN ("totalSell" - "totalCost") > 0 THEN ("totalSell" - "totalCost") ELSE 0 END',
            })
                .where('id = :id', { id: dto.projectId })
                .execute();
            const updatedProject = await projRepo.findOne({
                where: { id: dto.projectId },
            });
            const currentProfit = Number(updatedProject?.totalProfit || 0);
            const alreadyDistributed = Number(updatedProject?.distributedProfit || 0);
            const delta = currentProfit - alreadyDistributed;
            if (delta > 0) {
                const users = await this.usersRepo
                    .createQueryBuilder('u')
                    .leftJoinAndSelect('u.investorType', 'investorType')
                    .where('u.role = :role', { role: user_entity_1.UserRole.INVESTOR })
                    .andWhere('u.isBanned = :banned', { banned: false })
                    .andWhere('u.totalInvestment > 0')
                    .getMany();
                const totalInvest = users.reduce((sum, u) => sum + Number(u.totalInvestment || 0), 0);
                if (users.length > 0 && totalInvest > 0) {
                    let totalWithheld = 0;
                    for (const u of users) {
                        const share = Number(u.totalInvestment || 0) / totalInvest;
                        const base = delta * share;
                        const deductionPercent = u.investorType && u.investorType.percentage != null
                            ? Number(u.investorType.percentage)
                            : 0;
                        const deductionFraction = deductionPercent / 100;
                        const withheld = base * deductionFraction;
                        const final = base - withheld;
                        totalWithheld += withheld;
                        if (final !== 0) {
                            await this.usersRepo
                                .createQueryBuilder()
                                .update(user_entity_1.UserEntity)
                                .set({
                                totalProfit: () => `"totalProfit" + ${final}`,
                            })
                                .where('id = :id', { id: u.id })
                                .execute();
                        }
                    }
                    if (totalWithheld > 0) {
                        await this.partnerService.distributeCommissionWithManager(manager, totalWithheld);
                    }
                    await projRepo
                        .createQueryBuilder()
                        .update(project_entity_1.Project)
                        .set({
                        distributedProfit: () => `"distributedProfit" + ${delta}`,
                    })
                        .where('id = :id', { id: dto.projectId })
                        .execute();
                }
            }
            return saved;
        });
    }
    async findAll() {
        return this.dailyReportRepo.find({
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const entity = await this.dailyReportRepo.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`DailyReport with id "${id}" not found`);
        }
        return entity;
    }
    async update(id, updateDailyReportDto) {
        const existing = await this.findOne(id);
        const merged = this.dailyReportRepo.merge(existing, updateDailyReportDto);
        return this.dailyReportRepo.save(merged);
    }
    async remove(id) {
        await this.dailyReportRepo.delete(id);
    }
};
exports.DailyReportService = DailyReportService;
exports.DailyReportService = DailyReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_report_entity_1.DailyReport)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        investment_service_1.InvestmentService,
        partner_service_1.PartnerService])
], DailyReportService);
//# sourceMappingURL=daily-report.service.js.map