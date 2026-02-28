import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectPeriodDto } from './dto/create-project-period.dto';
import { UpdateProjectPeriodDto } from './dto/update-project-period.dto';
import { ProjectPeriodEntity } from './entities/project-period.entity';

@Injectable()
export class ProjectPeriodService {
  constructor(
    @InjectRepository(ProjectPeriodEntity)
    private readonly projectPeriodRepository: Repository<ProjectPeriodEntity>,
  ) {}

  async create(
    createProjectPeriodDto: CreateProjectPeriodDto,
  ): Promise<ProjectPeriodEntity> {
    const period = this.projectPeriodRepository.create(createProjectPeriodDto);
    return this.projectPeriodRepository.save(period);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{
    items: ProjectPeriodEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder =
      this.projectPeriodRepository.createQueryBuilder('project_period');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere('project_period.duration LIKE :search', {
        search: likeSearch,
      });
    }

    queryBuilder
      .orderBy('project_period.startDate', 'DESC')
      .addOrderBy('project_period.id', 'DESC')
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

  async findOne(id: number): Promise<ProjectPeriodEntity> {
    const period = await this.projectPeriodRepository.findOne({
      where: { id },
    });
    if (!period) {
      throw new NotFoundException(`Project period with id "${id}" not found`);
    }
    return period;
  }

  async update(
    id: number,
    updateProjectPeriodDto: UpdateProjectPeriodDto,
  ): Promise<ProjectPeriodEntity> {
    const period = await this.findOne(id);
    const merged = this.projectPeriodRepository.merge(
      period,
      updateProjectPeriodDto,
    );
    return this.projectPeriodRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectPeriodRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project period with id "${id}" not found`);
    }
  }
}
