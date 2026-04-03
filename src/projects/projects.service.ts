import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { GlarryEntity } from 'src/glarry/entities/glarry.entity';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { DistributeProfitDto } from './dto/distribute-profit.dto';

import { PartnerService } from 'src/partner/partner.service';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(GlarryEntity)
    private readonly glarryRepo: Repository<GlarryEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly partnerService: PartnerService,
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
            'CASE WHEN ("totalSell" - "totalCost") > 0 THEN ("totalSell" - "totalCost") ELSE 0 END',
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
          let totalWithheld = 0;
          for (const u of users) {
            const share = Number(u.totalInvestment || 0) / totalInvest;
            const base = delta * share;
            const deductionPercent =
              u.investorType && u.investorType.percentage != null
                ? Number(u.investorType.percentage)
                : 0;
            const deductionFraction = deductionPercent / 100;
            const withheld = base * deductionFraction;
            const final = base - withheld;
            totalWithheld += withheld;
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

          if (totalWithheld > 0) {
            await this.partnerService.distributeCommissionWithManager(manager, totalWithheld);
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
    investorTotalInvestment: number;
    partnerTotalInvestment: number;
    moduleCounts?: Record<string, number>;
  }> {
    const raw = await this.projectsRepo
      .createQueryBuilder('p')
      .select('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(p.totalInvestment), 0)', 'totalInvestment')
      .addSelect('COALESCE(SUM(p.totalSell), 0)', 'totalSell')
      .addSelect('COALESCE(SUM(p.totalCost), 0)', 'totalCost')
      .addSelect(
        'COALESCE(SUM(CASE WHEN (p.totalSell - p.totalCost) > 0 THEN (p.totalSell - p.totalCost) ELSE 0 END), 0)',
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

    const userInvestments = await this.usersRepo
      .createQueryBuilder('u')
      .select('u.role', 'role')
      .addSelect('COALESCE(SUM(u."totalInvestment"), 0)', 'totalInvestment')
      .groupBy('u.role')
      .getRawMany<{ role: string; totalInvestment: string | number }>();

    let investorTotalInvestment = 0;
    let partnerTotalInvestment = 0;

    userInvestments.forEach(item => {
      if (item.role === 'investor') investorTotalInvestment = Number(item.totalInvestment);
      if (item.role === 'partner') partnerTotalInvestment = Number(item.totalInvestment);
    });

    const countsRaw = await this.projectsRepo.manager.query(`
      SELECT 
        (SELECT COUNT(*) FROM "tbl_users") as users,
        (SELECT COUNT(*) FROM "tbl_investments") as investments,
        (SELECT COUNT(*) FROM "tbl_deeds") as deeds,
        (SELECT COUNT(*) FROM "tbl_notices") as notices,
        (SELECT COUNT(*) FROM "tbl_banners") as banners,
        (SELECT COUNT(*) FROM "tbl_glarry") as glarry,
        (SELECT COUNT(*) FROM "tbl_contact_message") as contacts,
        (SELECT COUNT(*) FROM "tbl_daily_reports") as reports,
        (SELECT COUNT(*) FROM "partner_payouts") as partnerpayouts,
        (SELECT COUNT(*) FROM "tbl_investor_types") as investortypes,
        (SELECT COUNT(*) FROM "tbl_investamounts") as investamounts
    `);

    const moduleCounts = countsRaw && countsRaw[0] ? {
      users: Number(countsRaw[0].users || 0),
      investments: Number(countsRaw[0].investments || 0),
      deeds: Number(countsRaw[0].deeds || 0),
      notices: Number(countsRaw[0].notices || 0),
      banners: Number(countsRaw[0].banners || 0),
      glarry: Number(countsRaw[0].glarry || 0),
      contacts: Number(countsRaw[0].contacts || 0),
      reports: Number(countsRaw[0].reports || 0),
      partnerPayouts: Number(countsRaw[0].partnerpayouts || 0),
      investorTypes: Number(countsRaw[0].investortypes || 0),
      investAmounts: Number(countsRaw[0].investamounts || 0),
    } : {};

    return {
      totalProjects,
      totalInvestment,
      totalSell,
      totalCost,
      totalProfit,
      activeInvestors,
      avgYieldPercent,
      investorTotalInvestment,
      partnerTotalInvestment,
      moduleCounts,
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
        const deductionPercent =
          u.investorType && u.investorType.percentage != null
            ? Number(u.investorType.percentage)
            : 0;
        const deductionFraction = deductionPercent / 100;
        const withheld = base * deductionFraction;
        const final = base - withheld;
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
          investorTypePercent: deductionPercent,
          final,
          withheld,
        });
      }
      const totalDistributed = items.reduce((s, i) => s + i.final, 0);
      const totalWithheld = items.reduce((s, i) => s + i.withheld, 0);

      if (totalWithheld > 0) {
        await this.partnerService.distributeCommissionWithManager(manager, totalWithheld);
      }

      return { pool, totalWithheld, totalDistributed, items };
    });
  }

  async onModuleInit() {
    console.log('Recalculating all project profits...');
    await this.projectsRepo
      .createQueryBuilder()
      .update(Project)
      .set({
        totalProfit: () =>
          'CASE WHEN ("totalSell" - "totalCost") > 0 THEN ("totalSell" - "totalCost") ELSE 0 END',
      } as any)
      .execute();
    console.log('Profit recalculation complete.');
  }
}
