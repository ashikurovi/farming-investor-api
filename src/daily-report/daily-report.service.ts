import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { UpdateDailyReportDto } from './dto/update-daily-report.dto';
import { DailyReport } from './entities/daily-report.entity';
import { Project } from '../projects/entities/project.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';
import { InvestmentService } from '../investment/investment.service';

import { PartnerService } from 'src/partner/partner.service';

@Injectable()
export class DailyReportService {
  constructor(
    @InjectRepository(DailyReport)
    private readonly dailyReportRepo: Repository<DailyReport>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly investmentService: InvestmentService,
    private readonly partnerService: PartnerService,
  ) {}

  async create(dto: CreateDailyReportDto) {
    await this.investmentService.refreshInvestmentStatuses();

    return this.dailyReportRepo.manager.transaction(async (manager) => {
      const projRepo = manager.getRepository(Project);
      const reportRepo = manager.getRepository(DailyReport);

      const project = await projRepo.findOne({ where: { id: dto.projectId } });
      if (!project) {
        throw new NotFoundException(
          `Project with id "${dto.projectId}" not found`,
        );
      }

      const entity = reportRepo.create(dto as DailyReport);
      const saved = await reportRepo.save(entity);

      if (dto.dailyCost && Number(dto.dailyCost) !== 0) {
        const dailyCostNum = Number(dto.dailyCost);
        await projRepo.increment(
          { id: dto.projectId },
          'totalCost',
          dailyCostNum,
        );
        await projRepo.increment(
          { id: dto.projectId },
          'totalInvestment',
          dailyCostNum,
        );

        const eligibleUsers = await this.usersRepo
          .createQueryBuilder('u')
          .where('u.role = :role', { role: UserRole.INVESTOR })
          .andWhere('u.isBanned = :banned', { banned: false })
          .andWhere('u.balance > 0')
          .andWhere('u.totalInvestment > 0')
          .getMany();
        const eligibleCount = eligibleUsers.length;
        if (eligibleCount > 0) {
          const perUser = dailyCostNum / eligibleCount;
          for (const u of eligibleUsers) {
            const currentBalance = Number(u.balance || 0);
            if (currentBalance <= 0) {
              continue;
            }
            const deduction = Math.min(currentBalance, perUser);
            if (deduction <= 0) {
              continue;
            }
            await this.usersRepo
              .createQueryBuilder()
              .update(UserEntity)
              .set({
                balance: () => `"balance" - ${deduction}`,
                totalCost: () => `"totalCost" + ${deduction}`,
              } as any)
              .where('id = :id', { id: u.id })
              .andWhere('balance > 0')
              .execute();
          }
        }
      }
      if (dto.dailySell && Number(dto.dailySell) !== 0) {
        await projRepo.increment(
          { id: dto.projectId },
          'totalSell',
          Number(dto.dailySell),
        );
      }

      await projRepo
        .createQueryBuilder()
        .update(Project)
        .set({
          totalProfit: () =>
            'CASE WHEN ("totalSell" - "totalCost") > 0 THEN ("totalSell" - "totalCost") ELSE 0 END',
        } as any)
        .where('id = :id', { id: dto.projectId })
        .execute();

      const updatedProject = await projRepo.findOne({
        where: { id: dto.projectId },
      });
      const currentProfit = Number(updatedProject?.totalProfit || 0);
      const alreadyDistributed = Number(updatedProject?.distributedProfit || 0);
      const delta = currentProfit - alreadyDistributed;
      if (delta > 0) {
        const users = await this.usersRepo
          .createQueryBuilder('u')
          .leftJoinAndSelect('u.investorType', 'investorType')
          .where('u.role = :role', { role: UserRole.INVESTOR })
          .andWhere('u.isBanned = :banned', { banned: false })
          .andWhere('u.totalInvestment > 0')
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
              await this.usersRepo
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
            .where('id = :id', { id: dto.projectId })
            .execute();
        }
      }
      return saved;
    });
  }

  async findAll() {
    return this.dailyReportRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const entity = await this.dailyReportRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`DailyReport with id "${id}" not found`);
    }
    return entity;
  }

  async update(id: number, updateDailyReportDto: UpdateDailyReportDto) {
    const existing = await this.findOne(id);
    const merged = this.dailyReportRepo.merge(existing, updateDailyReportDto);
    return this.dailyReportRepo.save(merged);
  }

  async remove(id: number) {
    await this.dailyReportRepo.delete(id);
  }
}
