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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
const investor_type_entity_1 = require("../investor-type/entities/investor-type.entity");
const investment_entity_1 = require("../investment/entities/investment.entity");
const partner_service_1 = require("../partner/partner.service");
const investor_payout_entity_1 = require("./entities/investor-payout.entity");
let UsersService = class UsersService {
    constructor(usersRepository, investorTypeRepository, investmentRepository, jwtService, partnerService) {
        this.usersRepository = usersRepository;
        this.investorTypeRepository = investorTypeRepository;
        this.investmentRepository = investmentRepository;
        this.jwtService = jwtService;
        this.partnerService = partnerService;
    }
    async create(createUserDto) {
        let investorType = null;
        if (createUserDto.investorTypeId != null) {
            investorType = await this.investorTypeRepository.findOne({
                where: { id: createUserDto.investorTypeId },
            });
            if (!investorType) {
                throw new common_1.BadRequestException('Investor type not found');
            }
        }
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            investorType: investorType ?? undefined,
        });
        return this.usersRepository.save(user);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.investorType', 'investorType');
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('user.id', 'DESC')
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
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['investorType'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id "${id}" not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        return this.usersRepository.manager.transaction(async (manager) => {
            const usersRepo = manager.getRepository(user_entity_1.UserEntity);
            const user = await usersRepo.findOne({
                where: { id },
                relations: ['investorType'],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with id "${id}" not found`);
            }
            let payload = { ...updateUserDto };
            if (updateUserDto.password) {
                const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
                payload.password = hashedPassword;
            }
            let retroactiveDeduction = 0;
            if (updateUserDto.investorTypeId !== undefined) {
                if (updateUserDto.investorTypeId === null) {
                    user.investorType = null;
                    user.investorTypeId = null;
                }
                else {
                    if (user.investorType?.id !== updateUserDto.investorTypeId) {
                        const newType = await manager.getRepository(investor_type_entity_1.InvestorTypeEntity).findOne({
                            where: { id: updateUserDto.investorTypeId },
                        });
                        if (newType) {
                            const currentProfit = Number(user.totalProfit || 0);
                            const newPercentage = Number(newType.percentage || 0);
                            if (currentProfit > 0 && newPercentage > 0) {
                                retroactiveDeduction = currentProfit * (newPercentage / 100);
                                user.totalProfit = currentProfit - retroactiveDeduction;
                            }
                            user.investorType = newType;
                            user.investorTypeId = updateUserDto.investorTypeId;
                        }
                    }
                }
            }
            const merged = usersRepo.merge(user, payload);
            const savedUser = await usersRepo.save(merged);
            if (retroactiveDeduction > 0) {
                await this.partnerService.distributeCommissionWithManager(manager, retroactiveDeduction);
            }
            return savedUser;
        });
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with id "${id}" not found`);
        }
    }
    async login(loginUserDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginUserDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isBanned) {
            throw new common_1.UnauthorizedException('User is banned');
        }
        if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { email: forgotPasswordDto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        return;
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { email: resetPasswordDto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        await this.usersRepository.save(user);
    }
    async ban(id) {
        const user = await this.findOne(id);
        user.isBanned = true;
        return this.usersRepository.save(user);
    }
    async unban(id) {
        const user = await this.findOne(id);
        user.isBanned = false;
        return this.usersRepository.save(user);
    }
    async logout() {
        return;
    }
    async investmentsWithStats(userId, options = {}) {
        const user = await this.findOne(userId);
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(Math.max(1, options.limit ?? 10), 100);
        const qb = this.investmentRepository
            .createQueryBuilder('inv')
            .leftJoinAndSelect('inv.deeds', 'deeds')
            .where('inv.investorId = :userId', { userId })
            .orderBy('inv.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await qb.getManyAndCount();
        const pageCount = limit > 0 ? Math.ceil(total / limit) || 1 : 1;
        const raw = await this.investmentRepository
            .createQueryBuilder('inv')
            .select('SUM(inv.amount)', 'total')
            .addSelect('COUNT(*)', 'count')
            .addSelect('AVG(inv.amount)', 'average')
            .where('inv.investorId = :userId', { userId })
            .getRawOne();
        const latest = await this.investmentRepository
            .createQueryBuilder('inv')
            .where('inv.investorId = :userId', { userId })
            .orderBy('inv.date', 'DESC')
            .addOrderBy('inv.time', 'DESC')
            .addOrderBy('inv.id', 'DESC')
            .getOne();
        return {
            items,
            meta: { total, page, limit, pageCount },
            stats: {
                total: raw?.total != null ? Number(raw.total) : 0,
                count: raw?.count != null ? Number(raw.count) : 0,
                average: raw?.average != null ? Number(raw.average) : 0,
                latestDate: latest?.date,
                latestTime: latest?.time,
            },
        };
    }
    async withdrawProfit(userId) {
        return this.usersRepository.manager.transaction(async (manager) => {
            const repo = manager.getRepository(user_entity_1.UserEntity);
            const user = await repo.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException(`User with id "${userId}" not found`);
            }
            const withdrawnProfit = Number(user.totalProfit || 0);
            if (withdrawnProfit > 0) {
                await repo
                    .createQueryBuilder()
                    .update(user_entity_1.UserEntity)
                    .set({
                    totalProfit: 0,
                    withdrawnProfit: () => `"withdrawnProfit" + ${withdrawnProfit}`
                })
                    .where('id = :id', { id: userId })
                    .execute();
            }
            return { userId, withdrawnProfit };
        });
    }
    async withdrawAll(userId) {
        return this.usersRepository.manager.transaction(async (manager) => {
            const repo = manager.getRepository(user_entity_1.UserEntity);
            const user = await repo.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException(`User with id "${userId}" not found`);
            }
            const withdrawnProfit = Number(user.totalProfit || 0);
            const withdrawnInvestment = Number(user.totalInvestment || 0);
            await repo
                .createQueryBuilder()
                .update(user_entity_1.UserEntity)
                .set({
                totalProfit: 0,
                totalInvestment: 0,
                withdrawnProfit: () => `"withdrawnProfit" + ${withdrawnProfit}`
            })
                .where('id = :id', { id: userId })
                .execute();
            return { userId, withdrawnProfit, withdrawnInvestment };
        });
    }
    async payout(userId) {
        return this.usersRepository.manager.transaction(async (manager) => {
            const userRepo = manager.getRepository(user_entity_1.UserEntity);
            const user = await userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException(`User with id "${userId}" not found`);
            }
            const totalInvestment = Number(user.totalInvestment || 0);
            const totalCost = Number(user.totalCost || 0);
            const totalProfit = Number(user.totalProfit || 0);
            const amount = totalInvestment + totalProfit;
            if (totalInvestment === 0 && totalCost === 0 && totalProfit === 0) {
                throw new common_1.BadRequestException('All selected balances are already zero');
            }
            await userRepo
                .createQueryBuilder()
                .update(user_entity_1.UserEntity)
                .set({
                totalProfit: 0,
                totalInvestment: 0,
                totalCost: 0,
                withdrawnProfit: () => `"withdrawnProfit" + ${totalProfit}`,
            })
                .where('id = :id', { id: userId })
                .execute();
            const reference = `INV-PYT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const payout = manager.getRepository(investor_payout_entity_1.InvestorPayout).create({
                investorId: userId,
                amount,
                totalInvestment,
                totalCost,
                totalProfit,
                reference,
            });
            return manager.getRepository(investor_payout_entity_1.InvestorPayout).save(payout);
        });
    }
    async getPayouts(userId) {
        return this.usersRepository.manager.getRepository(investor_payout_entity_1.InvestorPayout).find({
            where: { investorId: userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAllPayouts() {
        return this.usersRepository.manager.getRepository(investor_payout_entity_1.InvestorPayout).find({
            relations: ['investor'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(investor_type_entity_1.InvestorTypeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(investment_entity_1.Investment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        partner_service_1.PartnerService])
], UsersService);
//# sourceMappingURL=users.service.js.map