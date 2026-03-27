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
exports.NoticeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notice_entity_1 = require("./entities/notice.entity");
let NoticeService = class NoticeService {
    constructor(noticeRepository) {
        this.noticeRepository = noticeRepository;
    }
    async create(createNoticeDto) {
        const { isPublic, ...rest } = createNoticeDto;
        const notice = this.noticeRepository.create(rest);
        if (isPublic !== undefined) {
            notice.isPublic = isPublic;
        }
        return this.noticeRepository.save(notice);
    }
    async findAll(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const queryBuilder = this.noticeRepository.createQueryBuilder('notice');
        if (search && search.trim() !== '') {
            const likeSearch = `%${search.trim()}%`;
            queryBuilder.andWhere('(notice.title LIKE :search OR notice.description LIKE :search)', { search: likeSearch });
        }
        queryBuilder
            .orderBy('notice.id', 'DESC')
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
        const notice = await this.noticeRepository.findOne({ where: { id } });
        if (!notice) {
            throw new common_1.NotFoundException(`Notice with id "${id}" not found`);
        }
        return notice;
    }
    async update(id, updateNoticeDto) {
        const notice = await this.findOne(id);
        const merged = this.noticeRepository.merge(notice, updateNoticeDto);
        return this.noticeRepository.save(merged);
    }
    async remove(id) {
        const result = await this.noticeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Notice with id "${id}" not found`);
        }
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notice_entity_1.NoticeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NoticeService);
//# sourceMappingURL=notice.service.js.map