import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<NoticeEntity> {
    const notice = this.noticeRepository.create({
      ...createNoticeDto,
      isPublic: createNoticeDto.isPublic === 'true' || createNoticeDto.isPublic === true,
    });
    return this.noticeRepository.save(notice);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<{
    items: NoticeEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search } = options;

    const queryBuilder = this.noticeRepository.createQueryBuilder('notice');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(notice.title LIKE :search OR notice.description LIKE :search)',
        { search: likeSearch },
      );
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

  async findOne(id: number): Promise<NoticeEntity> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`Notice with id "${id}" not found`);
    }
    return notice;
  }

  async update(
    id: number,
    updateNoticeDto: UpdateNoticeDto,
  ): Promise<NoticeEntity> {
    const notice = await this.findOne(id);
    
    // Convert isPublic string if sent via form-data
    if (updateNoticeDto.isPublic !== undefined) {
      updateNoticeDto.isPublic = updateNoticeDto.isPublic === 'true' || updateNoticeDto.isPublic === true;
    }

    const merged = this.noticeRepository.merge(notice, updateNoticeDto);
    return this.noticeRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.noticeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notice with id "${id}" not found`);
    }
  }
}
