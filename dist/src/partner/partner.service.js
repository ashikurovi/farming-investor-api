"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const investment_entity_1 = require("../investment/entities/investment.entity");
let PartnerService = class PartnerService {
    constructor(usersRepository, investmentRepository) {
        this.usersRepository = usersRepository;
        this.investmentRepository = investmentRepository;
    }
    async create(createPartnerDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createPartnerDto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
        const user = this.usersRepository.create({
            ...createPartnerDto,
            password: hashedPassword,
            role: user_entity_1.UserRole.PARTNER,
        });
        return this.usersRepository.save(user);
    }
    async findAll() {
        return this.usersRepository.find({
            where: { role: user_entity_1.UserRole.PARTNER },
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id, role: user_entity_1.UserRole.PARTNER },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Partner with id "${id}" not found`);
        }
        return user;
    }
    async invest(partnerId, dto) {
        const partner = await this.findOne(partnerId);
        return await this.usersRepository.manager.transaction(async (manager) => {
            const investment = manager.getRepository(investment_entity_1.Investment).create({
                investorId: partnerId,
                amount: dto.amount,
                reference: dto.reference,
                date: dto.date,
                time: dto.time,
                isActive: true,
            });
            const savedInvestment = await manager.getRepository(investment_entity_1.Investment).save(investment);
            await manager.getRepository(user_entity_1.UserEntity).increment({ id: partnerId }, 'totalInvestment', dto.amount);
            await manager.getRepository(user_entity_1.UserEntity).increment({ id: partnerId }, 'balance', dto.amount);
            return savedInvestment;
        });
    }
    async distributeCommission(dto) {
        return await this.usersRepository.manager.transaction(async (manager) => {
            const partners = await manager.getRepository(user_entity_1.UserEntity).find({
                where: { role: user_entity_1.UserRole.PARTNER },
            });
            const partnersWithInvestment = partners.filter(p => Number(p.totalInvestment) > 0);
            if (partnersWithInvestment.length === 0) {
                throw new common_1.BadRequestException('No partners with active investment found to distribute commission');
            }
            const totalPartnerInvestment = partnersWithInvestment.reduce((sum, p) => sum + Number(p.totalInvestment), 0);
            const distributions = [];
            for (const partner of partnersWithInvestment) {
                const partnerInvestment = Number(partner.totalInvestment);
                const profitShare = (partnerInvestment / totalPartnerInvestment) * dto.amount;
                await manager.getRepository(user_entity_1.UserEntity).increment({ id: partner.id }, 'totalProfit', profitShare);
                distributions.push({
                    partnerId: partner.id,
                    name: partner.name,
                    investment: partnerInvestment,
                    sharePercentage: ((partnerInvestment / totalPartnerInvestment) * 100).toFixed(2) + '%',
                    profitReceived: profitShare
                });
            }
            return {
                success: true,
                totalDistributed: dto.amount,
                totalPartnerInvestment,
                distributions
            };
        });
    }
    async distributeCommissionWithManager(manager, commissionAmount) {
        if (commissionAmount <= 0)
            return;
        const usersRepo = manager.getRepository(user_entity_1.UserEntity);
        const partners = await usersRepo.find({
            where: { role: user_entity_1.UserRole.PARTNER },
        });
        const partnersWithInvestment = partners.filter(p => Number(p.totalInvestment) > 0);
        if (partnersWithInvestment.length === 0)
            return;
        const totalPartnerInvestment = partnersWithInvestment.reduce((sum, p) => sum + Number(p.totalInvestment), 0);
        for (const partner of partnersWithInvestment) {
            const partnerInvestment = Number(partner.totalInvestment);
            const profitShare = (partnerInvestment / totalPartnerInvestment) * commissionAmount;
            if (profitShare !== 0) {
                await usersRepo
                    .createQueryBuilder()
                    .update(user_entity_1.UserEntity)
                    .set({
                    totalProfit: () => `"totalProfit" + ${profitShare}`,
                })
                    .where('id = :id', { id: partner.id })
                    .execute();
            }
        }
    }
};
exports.PartnerService = PartnerService;
exports.PartnerService = PartnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(investment_entity_1.Investment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PartnerService);
//# sourceMappingURL=partner.service.js.map