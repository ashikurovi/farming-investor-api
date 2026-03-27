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
let InvestmentService = class InvestmentService {
    constructor(investmentRepo, userRepo) {
        this.investmentRepo = investmentRepo;
        this.userRepo = userRepo;
    }
    async create(createInvestmentDto) {
        const user = await this.userRepo.findOne({
            where: { id: createInvestmentDto.investorId },
        });
        if (!user) {
            throw new common_1.BadRequestException('Investor not found');
        }
        const investment = this.investmentRepo.create({
            investorId: createInvestmentDto.investorId,
            amount: createInvestmentDto.amount,
            reference: createInvestmentDto.reference,
            photoUrl: createInvestmentDto.photoUrl,
            date: createInvestmentDto.date,
            time: createInvestmentDto.time,
        });
        const saved = await this.investmentRepo.manager.transaction(async (manager) => {
            const invSaved = await manager
                .getRepository(investment_entity_1.Investment)
                .save(investment);
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: user.id }, 'totalInvestment', Number(invSaved.amount));
            await manager
                .getRepository(user_entity_1.UserEntity)
                .increment({ id: user.id }, 'balance', Number(invSaved.amount));
            return invSaved;
        });
        return saved;
    }
    async findAll() {
        return this.investmentRepo.find({
            order: { id: 'DESC' },
            relations: ['investor'],
        });
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
        const entity = await this.investmentRepo.findOne({
            where: { id },
            relations: ['investor'],
        });
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
};
exports.InvestmentService = InvestmentService;
exports.InvestmentService = InvestmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investment_entity_1.Investment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvestmentService);
//# sourceMappingURL=investment.service.js.map