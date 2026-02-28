import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentEntity } from './entities/investment.entity';
import { ProjectEntity, ProjectStatus } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly projectsService: ProjectsService,
  ) {}

  async invest(
    userId: number,
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    const project = await this.projectRepository.findOne({
      where: { id: createInvestmentDto.projectId },
      select: ['id', 'totalPrice', 'collectedAmount', 'status', 'minInvestmentAmount'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id "${createInvestmentDto.projectId}" not found`);
    }
    if (project.status === ProjectStatus.CLOSED) {
      throw new BadRequestException('Cannot invest in a closed project');
    }
    const amount = Number(createInvestmentDto.amount);
    if (amount <= 0) {
      throw new BadRequestException('Investment amount must be greater than 0');
    }
    const minAmount = Number(project.minInvestmentAmount ?? 0);
    if (minAmount > 0 && amount < minAmount) {
      throw new BadRequestException(
        `Minimum investment for this project is ${minAmount}. You invested ${amount}.`,
      );
    }

    const remainingAmount =
      Number(project.totalPrice) - Number(project.collectedAmount);
    if (amount > remainingAmount) {
      throw new BadRequestException(
        `Investment amount cannot exceed remaining amount (${remainingAmount})`,
      );
    }

    const projectId = createInvestmentDto.projectId;
    let investment = await this.investmentRepository.findOne({
      where: { userId, projectId },
    });

    if (investment) {
      const previousAmount = Number(investment.amount);
      investment.amount = previousAmount + amount;
      await this.investmentRepository.save(investment);
    } else {
      investment = this.investmentRepository.create({
        userId,
        projectId,
        amount,
      });
      await this.investmentRepository.save(investment);
    }

    await this.projectsService.incrementCollectedAmount(projectId, amount);

    return this.investmentRepository.findOne({
      where: { id: investment.id },
      relations: ['project', 'user'],
    }) as Promise<InvestmentEntity>;
  }

  async findAllByUser(
    userId: number,
    options: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{
    items: InvestmentEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.investmentRepository
      .createQueryBuilder('investment')
      .leftJoinAndSelect('investment.project', 'project')
      .leftJoinAndSelect('investment.user', 'user')
      .where('investment.userId = :userId', { userId });

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(project.title ILIKE :search OR project.description ILIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('investment.createdAt', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items,
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  async findAllByProject(
    projectId: number,
    options: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{
    items: InvestmentEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    await this.projectsService.findOne(projectId);

    const { page = 1, limit = 10, search } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.investmentRepository
      .createQueryBuilder('investment')
      .leftJoinAndSelect('investment.user', 'user')
      .leftJoinAndSelect('investment.project', 'project')
      .where('investment.projectId = :projectId', { projectId });

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('investment.createdAt', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items,
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  /**
   * Per project: list of users and how much each invested (kon kon user koto invest korse).
   */
  async getInvestorsByProject(
    projectId: number,
    options: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{
    investors: { userId: number; name: string; email: string; phone: string; amount: number }[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    await this.projectsService.getInvestmentInfo(projectId);

    const { page = 1, limit = 10, search } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.investmentRepository
      .createQueryBuilder('investment')
      .innerJoinAndSelect('investment.user', 'user')
      .where('investment.projectId = :projectId', { projectId })
      .select([
        'investment.id',
        'investment.userId',
        'investment.amount',
        'user.id',
        'user.name',
        'user.email',
        'user.phone',
      ]);

    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('investment.amount', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    const investors = items.map((inv) => ({
      userId: inv.userId,
      name: inv.user?.name ?? '',
      email: inv.user?.email ?? '',
      phone: inv.user?.phone ?? '',
      amount: Number(inv.amount),
    }));

    return {
      investors,
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  /**
   * Get all investments (admin/list) with pagination and optional filters.
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: number;
    userId?: number;
  } = {}): Promise<{
    items: InvestmentEntity[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const { page = 1, limit = 10, search, projectId, userId } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.investmentRepository
      .createQueryBuilder('investment')
      .leftJoinAndSelect('investment.project', 'project')
      .leftJoinAndSelect('investment.user', 'user');

    if (projectId != null) {
      queryBuilder.andWhere('investment.projectId = :projectId', { projectId });
    }
    if (userId != null) {
      queryBuilder.andWhere('investment.userId = :userId', { userId });
    }
    if (search && search.trim() !== '') {
      const likeSearch = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(project.title ILIKE :search OR project.description ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)',
        { search: likeSearch },
      );
    }

    queryBuilder
      .orderBy('investment.createdAt', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const pageCount = safeLimit > 0 ? Math.ceil(total / safeLimit) || 1 : 1;

    return {
      items,
      meta: { total, page, limit: safeLimit, pageCount },
    };
  }

  /**
   * Global investment statistics.
   */
  async getStats(): Promise<{
    totalInvestments: number;
    totalAmountInvested: number;
    uniqueInvestors: number;
    uniqueProjectsInvested: number;
  }> {
    const [totalInvestments, totalAmountResult, uniqueInvestors, uniqueProjects] =
      await Promise.all([
        this.investmentRepository.count(),
        this.investmentRepository
          .createQueryBuilder('i')
          .select('COALESCE(SUM(CAST(i.amount AS DECIMAL)), 0)', 'total')
          .getRawOne<{ total: string }>(),
        this.investmentRepository
          .createQueryBuilder('i')
          .select('COUNT(DISTINCT i.userId)', 'count')
          .getRawOne<{ count: string }>(),
        this.investmentRepository
          .createQueryBuilder('i')
          .select('COUNT(DISTINCT i.projectId)', 'count')
          .getRawOne<{ count: string }>(),
      ]);

    return {
      totalInvestments,
      totalAmountInvested: Number(totalAmountResult?.total ?? 0),
      uniqueInvestors: Number(uniqueInvestors?.count ?? 0),
      uniqueProjectsInvested: Number(uniqueProjects?.count ?? 0),
    };
  }

  async findOne(id: number): Promise<InvestmentEntity> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['project', 'user'],
    });
    if (!investment) {
      throw new NotFoundException(`Investment with id "${id}" not found`);
    }
    return investment;
  }

  async remove(id: number, userId?: number): Promise<void> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with id "${id}" not found`);
    }
    if (userId != null && investment.userId !== userId) {
      throw new NotFoundException(`Investment with id "${id}" not found`);
    }
    const amount = Number(investment.amount);
    const projectId = investment.projectId;
    await this.investmentRepository.remove(investment);
    await this.projectsService.decrementCollectedAmount(projectId, amount);
  }
}
