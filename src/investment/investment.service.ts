import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment } from './entities/investment.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepo: Repository<Investment>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto) {
    const user = await this.userRepo.findOne({
      where: { id: createInvestmentDto.investorId },
    });
    if (!user) {
      throw new BadRequestException('Investor not found');
    }

    const investment = this.investmentRepo.create({
      investorId: createInvestmentDto.investorId,
      amount: createInvestmentDto.amount,
      reference: createInvestmentDto.reference,
      photoUrl: createInvestmentDto.photoUrl,
      date: createInvestmentDto.date,
      time: createInvestmentDto.time,
    });

    const saved = await this.investmentRepo.manager.transaction(
      async (manager) => {
        const invSaved = await manager
          .getRepository(Investment)
          .save(investment);
        await manager
          .getRepository(UserEntity)
          .increment(
            { id: user.id },
            'totalInvestment',
            Number(invSaved.amount),
          );
        await manager
          .getRepository(UserEntity)
          .increment({ id: user.id }, 'balance', Number(invSaved.amount));
        return invSaved;
      },
    );

    return saved;
  }

  async findAll() {
    return this.investmentRepo.find({ order: { id: 'DESC' } });
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
    const entity = await this.investmentRepo.findOne({ where: { id } });
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
}
