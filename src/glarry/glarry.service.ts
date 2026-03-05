import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlarryEntity } from './entities/glarry.entity';
import { CreateGlarryDto } from './dto/create-glarry.dto';
import { UpdateGlarryDto } from './dto/update-glarry.dto';

export type GlarryResponse = {
  id: number;
  projectId: number;
  photoUrl: string;
  projectName?: string;
};

@Injectable()
export class GlarryService {
  constructor(
    @InjectRepository(GlarryEntity)
    private readonly glarryRepo: Repository<GlarryEntity>,
  ) {}

  async create(createGlarryDto: CreateGlarryDto): Promise<GlarryResponse> {
    const glarry = this.glarryRepo.create({
      projectId: createGlarryDto.projectId,
      photoUrl: createGlarryDto.photoUrl,
    });
    const saved = await this.glarryRepo.save(glarry);
    return this.findOne(saved.id);
  }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      projectId?: number;
    } = {},
  ): Promise<{
    items: GlarryResponse[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, projectId } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const qb = this.glarryRepo
      .createQueryBuilder('glarry')
      .leftJoinAndSelect('glarry.project', 'project')
      .orderBy('glarry.id', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);
    if (projectId != null) {
      qb.where('glarry.project_id = :projectId', { projectId });
    }

    const [list, total] = await qb.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items: list.map((g) => this.toResponse(g)),
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  async findByProject(
    projectId: number,
    options: { page?: number; limit?: number } = {},
  ): Promise<{
    items: GlarryResponse[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const qb = this.glarryRepo
      .createQueryBuilder('glarry')
      .leftJoinAndSelect('glarry.project', 'project')
      .orderBy('glarry.id', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit)
      .where('glarry.project_id = :projectId', { projectId });

    const [list, total] = await qb.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items: list.map((g) => this.toResponse(g)),
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  async findOne(id: number): Promise<GlarryResponse> {
    const glarry = await this.glarryRepo.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!glarry) {
      throw new NotFoundException(`Glarry with id "${id}" not found`);
    }
    return this.toResponse(glarry);
  }

  async update(
    id: number,
    updateGlarryDto: UpdateGlarryDto,
  ): Promise<GlarryResponse> {
    const glarry = await this.glarryRepo.findOne({ where: { id } });
    if (!glarry) {
      throw new NotFoundException(`Glarry with id "${id}" not found`);
    }
    if (updateGlarryDto.projectId != null) {
      glarry.projectId = updateGlarryDto.projectId;
    }
    if (updateGlarryDto.photoUrl != null)
      glarry.photoUrl = updateGlarryDto.photoUrl;
    const saved = await this.glarryRepo.save(glarry);
    return this.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.glarryRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Glarry with id "${id}" not found`);
    }
  }

  private toResponse(g: GlarryEntity): GlarryResponse {
    return {
      id: g.id,
      projectId: g.projectId,
      photoUrl: g.photoUrl,
      projectName: g.project?.name,
    };
  }
}
