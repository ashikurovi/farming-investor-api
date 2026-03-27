import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment } from './entities/investment.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';

import { InvestamountService } from '../investamount/investamount.service';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepo: Repository<Investment>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly investAmountService: InvestamountService,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto) {
    const user = await this.userRepo.findOne({
      where: { id: createInvestmentDto.investorId },
    });
    if (!user) {
      throw new BadRequestException('Investor not found');
    }

    const unitSetting = await this.investAmountService.findFirst();
    const unitAmount = Number(unitSetting?.amount || 0);
    const totalAmount = Number(createInvestmentDto.amount);

    return await this.investmentRepo.manager.transaction(async (manager) => {
      const createdInvestments: Investment[] = [];

      if (unitAmount > 0 && totalAmount >= unitAmount) {
        let remainingAmount = totalAmount;
        while (remainingAmount >= unitAmount) {
          const investment = manager.getRepository(Investment).create({
            ...createInvestmentDto,
            amount: unitAmount,
          });
          const saved = await manager.getRepository(Investment).save(investment);
          createdInvestments.push(saved);
          remainingAmount -= unitAmount;
        }

        if (remainingAmount > 0) {
          const investment = manager.getRepository(Investment).create({
            ...createInvestmentDto,
            amount: remainingAmount,
          });
          const saved = await manager.getRepository(Investment).save(investment);
          createdInvestments.push(saved);
        }
      } else {
        const investment = manager.getRepository(Investment).create({
          ...createInvestmentDto,
          amount: totalAmount,
        });
        const saved = await manager.getRepository(Investment).save(investment);
        createdInvestments.push(saved);
      }

      // Update user balances once for the total amount
      await manager
        .getRepository(UserEntity)
        .increment({ id: user.id }, 'totalInvestment', totalAmount);
      await manager
        .getRepository(UserEntity)
        .increment({ id: user.id }, 'balance', totalAmount);

      // Return the first one but include all IDs for the frontend to handle deeds
      return {
        ...createdInvestments[0],
        id: createdInvestments[0].id,
        allIds: createdInvestments.map((inv) => inv.id),
        count: createdInvestments.length,
      };
    });
  }

  async findAll() {
    return this.investmentRepo.createQueryBuilder('investment')
      .leftJoinAndSelect('investment.investor', 'investor')
      .orderBy('investment.id', 'DESC')
      .getMany();
  }

  async stats(): Promise<{
    totalInvestmentCollect: number;
    totalInvestorCount: number;
    newInvestorCount: number;
  }> {
    const row = await this.investmentRepo
      .createQueryBuilder('inv')
      .select('COALESCE(SUM(inv.amount), 0)', 'total')
      .getRawOne<{ total: string | number }>();
    const totalInvestmentCollect = Number(row?.total ?? 0);
    const totalInvestorCount = await this.userRepo.count({
      where: { role: UserRole.INVESTOR },
    });
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newInvestorCount = await this.userRepo.count({
      where: { role: UserRole.INVESTOR, createdAt: MoreThan(thirtyDaysAgo) },
    });
    return { totalInvestmentCollect, totalInvestorCount, newInvestorCount };
  }

  async findRecent(limit = 5): Promise<
    Array<{
      id: number;
      investorId: number;
      investorName?: string;
      amount: number;
      date?: string;
      time?: string;
    }>
  > {
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const list = await this.investmentRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.investor', 'user')
      .orderBy('inv.id', 'DESC')
      .take(safeLimit)
      .getMany();
    return list.map((i) => ({
      id: i.id,
      investorId: i.investorId,
      investorName: (i as any)?.investor?.name,
      amount: Number(i.amount),
      date: i.date,
      time: i.time,
    }));
  }

  async findOne(id: number) {
    const entity = await this.investmentRepo.createQueryBuilder('investment')
      .leftJoinAndSelect('investment.investor', 'investor')
      .leftJoinAndSelect('investment.deeds', 'deeds')
      .where('investment.id = :id', { id })
      .getOne();
    if (!entity) {
      throw new NotFoundException(`Investment with id "${id}" not found`);
    }
    return entity;
  }

  async update(id: number, updateInvestmentDto: UpdateInvestmentDto) {
    const entity = await this.findOne(id);
    const beforeAmount = Number(entity.amount);
    const merged = this.investmentRepo.merge(entity, updateInvestmentDto);
    const saved = await this.investmentRepo.save(merged);
    if (updateInvestmentDto.amount != null) {
      const diff = Number(saved.amount) - beforeAmount;
      if (diff !== 0) {
        await this.userRepo.increment(
          { id: saved.investorId },
          'totalInvestment',
          diff,
        );
        await this.userRepo.increment(
          { id: saved.investorId },
          'balance',
          diff,
        );
      }
    }
    return saved;
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.investmentRepo.manager.transaction(async (manager) => {
      await manager.getRepository(Investment).delete(id);
      await manager
        .getRepository(UserEntity)
        .increment(
          { id: entity.investorId },
          'totalInvestment',
          -Number(entity.amount),
        );
      await manager
        .getRepository(UserEntity)
        .increment(
          { id: entity.investorId },
          'balance',
          -Number(entity.amount),
        );
    });
    return { deleted: true };
  }

  async refreshInvestmentStatuses() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Find all active investments that have reached their end date
    const expiredInvestments = await this.investmentRepo
      .createQueryBuilder('inv')
      .where('inv.isActive = :active', { active: true })
      .andWhere('inv.endDate IS NOT NULL')
      .andWhere('inv.endDate < :today', { today })
      .getMany();

    if (expiredInvestments.length === 0) {
      return;
    }

    await this.investmentRepo.manager.transaction(async (manager) => {
      for (const inv of expiredInvestments) {
        // Deactivate the investment
        await manager
          .getRepository(Investment)
          .update({ id: inv.id }, { isActive: false });

        // Decrement the user's total investment
        await manager
          .getRepository(UserEntity)
          .increment(
            { id: inv.investorId },
            'totalInvestment',
            -Number(inv.amount),
          );
      }
    });
  }
}
