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
let UsersService = class UsersService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async create(createUserDto) {
        const existing = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search, } = options;
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('user.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pageCount = limit > 0 ? Math.ceil(total / limit) || 1 : 1;
        return {
            items,
            meta: {
                total,
                page,
                limit,
                pageCount,
            },
        };
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id "${id}" not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        let payload = updateUserDto;
        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            payload = { ...updateUserDto, password: hashedPassword };
        }
        const merged = this.usersRepository.merge(user, payload);
        return this.usersRepository.save(merged);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map