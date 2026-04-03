import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deed } from './entities/deed.entity';

@Injectable()
export class DeedService {
  constructor(
    @InjectRepository(Deed)
    private readonly deedRepository: Repository<Deed>,
  ) {}

  async create(createDeedDto: CreateDeedDto) {
    const deed = this.deedRepository.create(createDeedDto);
    return await this.deedRepository.save(deed);
  }

  async findAll({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.deedRepository.createQueryBuilder('deed')
      .leftJoinAndSelect('deed.investment', 'investment')
      .leftJoinAndSelect('investment.investor', 'investor')
      .orderBy('deed.createdAt', 'DESC');

    if (search) {
      queryBuilder.where(
        'deed.title ILIKE :search OR investor.name ILIKE :search OR investor.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const deed = await this.deedRepository.findOne({ 
      where: { id },
      relations: ['investment']
    });
    if (!deed) {
      throw new NotFoundException(`Deed with ID ${id} not found`);
    }
    return deed;
  }

  async update(id: number, updateDeedDto: UpdateDeedDto) {
    const deed = await this.findOne(id);
    this.deedRepository.merge(deed, updateDeedDto);
    return await this.deedRepository.save(deed);
  }

  async remove(id: number) {
    const deed = await this.findOne(id);
    return await this.deedRepository.remove(deed);
  }
}
