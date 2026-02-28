import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerEntity } from './entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<BannerEntity> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{
    items: BannerEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const {
      page = 1,
      limit = 10,
      search,
    } = options;

    const queryBuilder = this.bannerRepository.createQueryBuilder('banner');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(banner.title LIKE :search OR banner.shortDescription LIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('banner.order', 'ASC')
      .addOrderBy('banner.id', 'DESC')
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

  async findOne(id: number): Promise<BannerEntity> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with id "${id}" not found`);
    }
    return banner;
  }

  async update(id: number, updateBannerDto: UpdateBannerDto): Promise<BannerEntity> {
    const banner = await this.findOne(id);
    const merged = this.bannerRepository.merge(banner, updateBannerDto);
    return this.bannerRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bannerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Banner with id "${id}" not found`);
    }
  }
}

