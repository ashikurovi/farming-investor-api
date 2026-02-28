import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity, ProjectStatus } from './entities/project.entity';
import { ProjectPeriodService } from 'src/project-period/project-period.service';
import { InvestmentEntity } from 'src/investments/entities/investment.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    private readonly projectPeriodService: ProjectPeriodService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const { projectPeriodId, ...rest } = createProjectDto;
    const projectPeriod = await this.projectPeriodService.findOne(projectPeriodId);
    const project = this.projectRepository.create({
      ...rest,
      projectPeriod,
      collectedAmount: 0,
      status: ProjectStatus.OPEN,
      minInvestmentAmount: rest.minInvestmentAmount ?? 0,
    });
    return this.projectRepository.save(project);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProjectStatus;
  } = {}): Promise<{
    items: ProjectEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search, status } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(project.title LIKE :search OR project.description LIKE :search)',
        { search: likeSearch },
      );
    }

    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    queryBuilder
      .leftJoinAndSelect('project.projectPeriod', 'projectPeriod')
      .orderBy('project.createdAt', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items,
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  async findOne(id: number, loadInvestments = true): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: loadInvestments
        ? ['investments', 'projectPeriod']
        : ['projectPeriod'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  async findOneForUpdate(id: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  /**
   * Global project stats (all projects).
   */
  async getGlobalStats(): Promise<{
    totalProjects: number;
    openProjects: number;
    closedProjects: number;
    totalTargetAmount: number;
    totalCollectedAmount: number;
    totalRemainingAmount: number;
    totalInvestors: number;
  }> {
    const [openCount, closedCount] = await Promise.all([
      this.projectRepository.count({ where: { status: ProjectStatus.OPEN } }),
      this.projectRepository.count({ where: { status: ProjectStatus.CLOSED } }),
    ]);

    const sums = await this.projectRepository
      .createQueryBuilder('p')
      .select('COALESCE(SUM(CAST(p.totalPrice AS DECIMAL)), 0)', 'totalTarget')
      .addSelect('COALESCE(SUM(CAST(p.collectedAmount AS DECIMAL)), 0)', 'totalCollected')
      .getRawOne<{ totalTarget: string; totalCollected: string }>();

    const investorResult = await this.investmentRepository
      .createQueryBuilder('i')
      .select('COUNT(DISTINCT i.user_id)', 'count')
      .getRawOne<{ count: string }>();

    const totalTarget = Number(sums?.totalTarget ?? 0);
    const totalCollected = Number(sums?.totalCollected ?? 0);

    return {
      totalProjects: openCount + closedCount,
      openProjects: openCount,
      closedProjects: closedCount,
      totalTargetAmount: totalTarget,
      totalCollectedAmount: totalCollected,
      totalRemainingAmount: Math.max(0, totalTarget - totalCollected),
      totalInvestors: Number(investorResult?.count ?? 0),
    };
  }

  /**
   * Stats for a single project.
   */
  async getProjectStats(projectId: number): Promise<{
    projectId: number;
    title: string;
    status: ProjectStatus;
    totalTargetAmount: number;
    collectedAmount: number;
    remainingAmount: number;
    progressPercent: number;
    investorCount: number;
  }> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      select: ['id', 'title', 'status', 'totalPrice', 'collectedAmount'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id "${projectId}" not found`);
    }

    const investorResult = await this.investmentRepository
      .createQueryBuilder('i')
      .where('i.project_id = :projectId', { projectId })
      .select('COUNT(DISTINCT i.user_id)', 'count')
      .getRawOne<{ count: string }>();

    const total = Number(project.totalPrice);
    const collected = Number(project.collectedAmount);
    const remaining = Math.max(0, total - collected);
    const progressPercent = total > 0 ? Math.min(100, (collected / total) * 100) : 0;

    return {
      projectId: project.id,
      title: project.title,
      status: project.status,
      totalTargetAmount: total,
      collectedAmount: collected,
      remainingAmount: remaining,
      progressPercent: Math.round(progressPercent * 100) / 100,
      investorCount: Number(investorResult?.count ?? 0),
    };
  }

  /** Returns only investment-related fields for a project (separate lightweight endpoint). */
  async getInvestmentInfo(projectId: number): Promise<{
    projectId: number;
    minInvestmentAmount: number;
    totalPrice: number;
    collectedAmount: number;
    remainingAmount: number;
    status: ProjectStatus;
  }> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      select: ['id', 'minInvestmentAmount', 'totalPrice', 'collectedAmount', 'status'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id "${projectId}" not found`);
    }
    const total = Number(project.totalPrice);
    const collected = Number(project.collectedAmount);
    return {
      projectId: project.id,
      minInvestmentAmount: Number(project.minInvestmentAmount ?? 0),
      totalPrice: total,
      collectedAmount: collected,
      remainingAmount: Math.max(0, total - collected),
      status: project.status,
    };
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.findOne(id, false);
    const { projectPeriodId, ...rest } = updateProjectDto as UpdateProjectDto & {
      projectPeriodId?: number;
    };
    const payload = projectPeriodId
      ? { ...rest, projectPeriod: { id: projectPeriodId } }
      : rest;
    const merged = this.projectRepository.merge(project, payload);
    return this.projectRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
  }

  async incrementCollectedAmount(
    projectId: number,
    amount: number,
  ): Promise<ProjectEntity> {
    const project = await this.findOneForUpdate(projectId);
    const newCollected = Number(project.collectedAmount) + Number(amount);
    project.collectedAmount = newCollected;

    if (newCollected >= Number(project.totalPrice)) {
      project.status = ProjectStatus.CLOSED;
    }

    return this.projectRepository.save(project);
  }

  async decrementCollectedAmount(
    projectId: number,
    amount: number,
  ): Promise<ProjectEntity> {
    const project = await this.findOneForUpdate(projectId);
    const newCollected = Math.max(
      0,
      Number(project.collectedAmount) - Number(amount),
    );
    project.collectedAmount = newCollected;

    if (newCollected < Number(project.totalPrice)) {
      project.status = ProjectStatus.OPEN;
    }

    return this.projectRepository.save(project);
  }
}
