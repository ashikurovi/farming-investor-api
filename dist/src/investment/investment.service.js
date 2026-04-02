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
exports.InvestmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investment_entity_1 = require("./entities/investment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const investamount_service_1 = require("../investamount/investamount.service");
let InvestmentService = class InvestmentService {
    constructor(investmentRepo, userRepo, investAmountService) {
        this.investmentRepo = investmentRepo;
        this.userRepo = userRepo;
        this.investAmountService = investAmountService;
    }
    async create(createInvestmentDto) {
        const user = await this.userRepo.findOne({
            where: { id: createInvestmentDto.investorId },
        });
        if (!user) {
            throw new common_1.BadRequestException('Investor not found');
        }
        const unitSetting = await this.investAmountService.findFirst();
        const unitAmount = Number(unitSetting?.amount || 0);
        const totalAmount = Number(createInvestmentDto.amount);
        return await this.investmentRepo.manager.transaction(async (manager) => {
            const createdInvestments = [];
            if (unitAmount > 0 && totalAmount >= unitAmount) {
                let remainingAmount = totalAmount;
                while (remainingAmount >= unitAmount) {
                    const investment = manager.getRepository(investment_entity_1.Investment).create({
                        ...createInvestmentDto,
                        amount: unitAmount,
                    });
                    const saved = await manager.getRepository(investment_entity_1.Investment).save(investment);
                    createdInvestments.push(saved);
                    remainingAmount -= unitAmount;
                }
                if (remainingAmount > 0) {
                    const investment = manager.getRepository(investment_entity_1.Investment).create({
                        ...createInvestmentDto,
                        amount: remainingAmount,
                    });
                    const saved = await manager.getRepository(investment_entity_1.Investment).save(investment);
                    createdInvestments.push(saved);
                }
            }
            else {
                const investment = manager.getRepository(investment_entity_1.Investment).create({
                    ...createInvestmentDto,
                    amount: totalAmount,
                });
                const saved = await manager.getRepository(investment_entity_1.Investment).save(investment);
                createdInvestments.push(saved);
            }
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: user.id }, 'totalInvestment', totalAmount);
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: user.id }, 'balance', totalAmount);
            return {
                ...createdInvestments[0],
                id: createdInvestments[0].id,
                allIds: createdInvestments.map((inv) => inv.id),
                count: createdInvestments.length,
            };
        });
    }
    async findAll() {
        return this.investmentRepo.createQueryBuilder('investment')
            .leftJoinAndSelect('investment.investor', 'investor')
            .orderBy('investment.id', 'DESC')
            .getMany();
    }
    async stats() {
        const row = await this.investmentRepo
            .createQueryBuilder('inv')
            .select('COALESCE(SUM(inv.amount), 0)', 'total')
            .getRawOne();
        const totalInvestmentCollect = Number(row?.total ?? 0);
        const totalInvestorCount = await this.userRepo.count({
            where: { role: user_entity_1.UserRole.INVESTOR },
        });
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newInvestorCount = await this.userRepo.count({
            where: { role: user_entity_1.UserRole.INVESTOR, createdAt: (0, typeorm_2.MoreThan)(thirtyDaysAgo) },
        });
        return { totalInvestmentCollect, totalInvestorCount, newInvestorCount };
    }
    async findRecent(limit = 5) {
        const safeLimit = Math.min(Math.max(1, limit), 50);
        const list = await this.investmentRepo
            .createQueryBuilder('inv')
            .leftJoinAndSelect('inv.investor', 'user')
            .orderBy('inv.id', 'DESC')
            .take(safeLimit)
            .getMany();
        return list.map((i) => ({
            id: i.id,
            investorId: i.investorId,
            investorName: i?.investor?.name,
            amount: Number(i.amount),
            date: i.date,
            time: i.time,
        }));
    }
    async findOne(id) {
        const entity = await this.investmentRepo.createQueryBuilder('investment')
            .leftJoinAndSelect('investment.investor', 'investor')
            .leftJoinAndSelect('investment.deeds', 'deeds')
            .where('investment.id = :id', { id })
            .getOne();
        if (!entity) {
            throw new common_1.NotFoundException(`Investment with id "${id}" not found`);
        }
        return entity;
    }
    async update(id, updateInvestmentDto) {
        const entity = await this.findOne(id);
        const beforeAmount = Number(entity.amount);
        const merged = this.investmentRepo.merge(entity, updateInvestmentDto);
        const saved = await this.investmentRepo.save(merged);
        if (updateInvestmentDto.amount != null) {
            const diff = Number(saved.amount) - beforeAmount;
            if (diff !== 0) {
                await this.userRepo.increment({ id: saved.investorId }, 'totalInvestment', diff);
                await this.userRepo.increment({ id: saved.investorId }, 'balance', diff);
            }
        }
        return saved;
    }
    async remove(id) {
        const entity = await this.findOne(id);
        await this.investmentRepo.manager.transaction(async (manager) => {
            await manager.getRepository(investment_entity_1.Investment).delete(id);
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: entity.investorId }, 'totalInvestment', -Number(entity.amount));
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: entity.investorId }, 'balance', -Number(entity.amount));
        });
        return { deleted: true };
    }
    async refreshInvestmentStatuses() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const expiredInvestments = await this.investmentRepo
            .createQueryBuilder('inv')
            .where('inv.isActive = :active', { active: true })
            .andWhere('inv.endDate IS NOT NULL')
            .andWhere('inv.endDate < :today', { today })
            .getMany();
        if (expiredInvestments.length === 0) {
            return;
        }
        await this.investmentRepo.manager.transaction(async (manager) => {
            for (const inv of expiredInvestments) {
                await manager
                    .getRepository(investment_entity_1.Investment)
                    .update({ id: inv.id }, { isActive: false });
                await manager
                    .getRepository(user_entity_1.UserEntity)
                    .increment({ id: inv.investorId }, 'totalInvestment', -Number(inv.amount));
            }
        });
    }
};
exports.InvestmentService = InvestmentService;
exports.InvestmentService = InvestmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investment_entity_1.Investment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        investamount_service_1.InvestamountService])
], InvestmentService);
//# sourceMappingURL=investment.service.js.map