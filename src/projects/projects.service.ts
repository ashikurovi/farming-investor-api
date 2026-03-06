import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { GlarryEntity } from 'src/glarry/entities/glarry.entity';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { DistributeProfitDto } from './dto/distribute-profit.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(GlarryEntity)
    private readonly glarryRepo: Repository<GlarryEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const entity = this.projectsRepo.create(createProjectDto);
    return this.projectsRepo.save(entity);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: { id },
      relations: ['glarry', 'dailyReports'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsRepo.manager.transaction(async (manager) => {
      const projRepo = manager.getRepository(Project);
      const usersRepo = manager.getRepository(UserEntity);
      const project = await projRepo.findOne({ where: { id } });
      if (!project) {
        throw new NotFoundException(`Project with id "${id}" not found`);
      }
      const beforeDistributed = Number(project.distributedProfit || 0);
      const merged = projRepo.merge(project, updateProjectDto);
      const saved = await projRepo.save(merged);

      await projRepo
        .createQueryBuilder()
        .update(Project)
        .set({
          totalProfit: () =>
            'CASE WHEN ("totalCost" - "totalSell") > 0 THEN ("totalCost" - "totalSell") ELSE 0 END',
        } as any)
        .where('id = :id', { id })
        .execute();

      const refreshed = await projRepo.findOne({ where: { id } });
      const currentProfit = Number(refreshed?.totalProfit || 0);
      const delta = currentProfit - beforeDistributed;
      if (delta > 0) {
        const users = await usersRepo
          .createQueryBuilder('u')
          .leftJoinAndSelect('u.investorType', 'investorType')
          .where('u.role = :role', { role: UserRole.INVESTOR })
          .andWhere('u.isBanned = :banned', { banned: false })
          .getMany();
        const totalInvest = users.reduce(
          (sum, u) => sum + Number(u.totalInvestment || 0),
          0,
        );
        if (users.length > 0 && totalInvest > 0) {
          for (const u of users) {
            const share = Number(u.totalInvestment || 0) / totalInvest;
            const base = delta * share;
            const investorTypePercent =
              u.investorType && u.investorType.percentage != null
                ? Number(u.investorType.percentage)
                : 100;
            const pct = investorTypePercent / 100;
            const final = base * pct;
            if (final !== 0) {
              await usersRepo
                .createQueryBuilder()
                .update(UserEntity)
                .set({
                  totalProfit: () => `"totalProfit" + ${final}`,
                } as any)
                .where('id = :id', { id: u.id })
                .execute();
            }
          }
          await projRepo
            .createQueryBuilder()
            .update(Project)
            .set({
              distributedProfit: () => `"distributedProfit" + ${delta}`,
            } as any)
            .where('id = :id', { id })
            .execute();
        }
      }
      return refreshed!;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
  }

  async getStats(): Promise<{
    totalProjects: number;
    totalInvestment: number;
    totalSell: number;
    totalCost: number;
    totalProfit: number;
    activeInvestors: number;
    avgYieldPercent: number;
  }> {
    const raw = await this.projectsRepo
      .createQueryBuilder('p')
      .select('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(p.totalInvestment), 0)', 'totalInvestment')
      .addSelect('COALESCE(SUM(p.totalSell), 0)', 'totalSell')
      .addSelect('COALESCE(SUM(p.totalCost), 0)', 'totalCost')
      .addSelect(
        'COALESCE(SUM(CASE WHEN (p.totalCost - p.totalSell) > 0 THEN (p.totalCost - p.totalSell) ELSE 0 END), 0)',
        'totalProfit',
      )
      .getRawOne<{
        count: string | number;
        totalInvestment: string | number;
        totalSell: string | number;
        totalCost: string | number;
        totalProfit: string | number;
      }>();

    const totalProjects = raw?.count != null ? Number(raw.count) : 0;
    const totalInvestment =
      raw?.totalInvestment != null ? Number(raw.totalInvestment) : 0;
    const totalSell = raw?.totalSell != null ? Number(raw.totalSell) : 0;
    const totalCost = raw?.totalCost != null ? Number(raw.totalCost) : 0;
    const totalProfit = raw?.totalProfit != null ? Number(raw.totalProfit) : 0;

    const activeInvestors = await this.usersRepo.count({
      where: { role: UserRole.INVESTOR, isBanned: false },
    });
    const profitTraditional = totalSell - totalCost;
    const avgYieldPercent =
      totalInvestment > 0 ? (profitTraditional / totalInvestment) * 100 : 0;

    return {
      totalProjects,
      totalInvestment,
      totalSell,
      totalCost,
      totalProfit,
      activeInvestors,
      avgYieldPercent,
    };
  }

  async distributeAllProfit(dto: DistributeProfitDto): Promise<{
    pool: number;
    totalWithheld: number;
    totalDistributed: number;
    items: Array<{
      userId: number;
      share: number;
      base: number;
      investorTypePercent: number;
      final: number;
      withheld: number;
    }>;
  }> {
    return this.projectsRepo.manager.transaction(async (manager) => {
      const projRepo = manager.getRepository(Project);
      const usersRepo = manager.getRepository(UserEntity);
      const raw = await projRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.totalProfit), 0)', 'pool')
        .getRawOne<{ pool: string | number }>();
      const sumProfit = raw?.pool != null ? Number(raw.pool) : 0;
      const pool = dto.amount != null ? Number(dto.amount) : sumProfit;
      if (!isFinite(pool) || pool <= 0) {
        throw new BadRequestException('Profit pool must be greater than 0');
      }
      const users = await usersRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.investorType', 'investorType')
        .where('u.role = :role', { role: UserRole.INVESTOR })
        .andWhere('u.isBanned = :banned', { banned: false })
        .getMany();
      if (users.length === 0) {
        throw new BadRequestException(
          'No eligible investors to distribute profit',
        );
      }
      const totalInvest = users.reduce(
        (sum, u) => sum + Number(u.totalInvestment || 0),
        0,
      );
      if (!isFinite(totalInvest) || totalInvest <= 0) {
        throw new BadRequestException(
          'Total investment across users must be greater than 0',
        );
      }
      const items: {
        userId: number;
        share: number;
        base: number;
        investorTypePercent: number;
        final: number;
        withheld: number;
      }[] = [];
      for (const u of users) {
        const share = Number(u.totalInvestment || 0) / totalInvest;
        const base = pool * share;
        const investorTypePercent =
          u.investorType && u.investorType.percentage != null
            ? Number(u.investorType.percentage)
            : 100;
        const pct = investorTypePercent / 100;
        const final = base * pct;
        const withheld = base - final;
        if (final !== 0) {
          await usersRepo
            .createQueryBuilder()
            .update(UserEntity)
            .set({
              totalProfit: () => `"totalProfit" + ${final}`,
            } as any)
            .where('id = :id', { id: u.id })
            .execute();
        }
        items.push({
          userId: u.id,
          share,
          base,
          investorTypePercent,
          final,
          withheld,
        });
      }
      const totalDistributed = items.reduce((s, i) => s + i.final, 0);
      const totalWithheld = items.reduce((s, i) => s + i.withheld, 0);
      return { pool, totalWithheld, totalDistributed, items };
    });
  }
}
