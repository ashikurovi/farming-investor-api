import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity, UserRole } from '../users/entities/user.entity';
import { Investment } from '../investment/entities/investment.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerInvestDto } from './dto/partner-invest.dto';
import { DistributeCommissionDto } from './dto/distribute-commission.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createPartnerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
    const user = this.usersRepository.create({
      ...createPartnerDto,
      password: hashedPassword,
      role: UserRole.PARTNER,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: { role: UserRole.PARTNER },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id, role: UserRole.PARTNER },
    });
    if (!user) {
      throw new NotFoundException(`Partner with id "${id}" not found`);
    }
    return user;
  }

  async invest(partnerId: number, dto: PartnerInvestDto) {
    const partner = await this.findOne(partnerId);

    return await this.usersRepository.manager.transaction(async (manager) => {
      const investment = manager.getRepository(Investment).create({
        investorId: partnerId,
        amount: dto.amount,
        reference: dto.reference,
        date: dto.date,
        time: dto.time,
        isActive: true,
      });

      const savedInvestment = await manager.getRepository(Investment).save(investment);

      await manager.getRepository(UserEntity).increment(
        { id: partnerId },
        'totalInvestment',
        dto.amount,
      );

      await manager.getRepository(UserEntity).increment(
        { id: partnerId },
        'balance',
        dto.amount,
      );

      return savedInvestment;
    });
  }

  async distributeCommission(dto: DistributeCommissionDto) {
    return await this.usersRepository.manager.transaction(async (manager) => {
      const partners = await manager.getRepository(UserEntity).find({
        where: { role: UserRole.PARTNER },
      });

      const partnersWithInvestment = partners.filter(p => Number(p.totalInvestment) > 0);

      if (partnersWithInvestment.length === 0) {
        throw new BadRequestException('No partners with active investment found to distribute commission');
      }

      const totalPartnerInvestment = partnersWithInvestment.reduce(
        (sum, p) => sum + Number(p.totalInvestment), 0
      );

      const distributions = [];

      for (const partner of partnersWithInvestment) {
        const partnerInvestment = Number(partner.totalInvestment);
        const profitShare = (partnerInvestment / totalPartnerInvestment) * dto.amount;

        await manager.getRepository(UserEntity).increment(
          { id: partner.id },
          'totalProfit',
          profitShare
        );

        distributions.push({
          partnerId: partner.id,
          name: partner.name,
          investment: partnerInvestment,
          sharePercentage: ((partnerInvestment / totalPartnerInvestment) * 100).toFixed(2) + '%',
          profitReceived: profitShare
        });
      }

      return {
        success: true,
        totalDistributed: dto.amount,
        totalPartnerInvestment,
        distributions
      };
    });
  }

  async distributeCommissionWithManager(
    manager: any,
    commissionAmount: number,
  ) {
    if (commissionAmount <= 0) return;
    const usersRepo = manager.getRepository(UserEntity);
    const partners = await usersRepo.find({
      where: { role: UserRole.PARTNER },
    });

    const partnersWithInvestment = partners.filter(p => Number(p.totalInvestment) > 0);
    if (partnersWithInvestment.length === 0) return;

    const totalPartnerInvestment = partnersWithInvestment.reduce(
      (sum, p) => sum + Number(p.totalInvestment), 0
    );

    for (const partner of partnersWithInvestment) {
      const partnerInvestment = Number(partner.totalInvestment);
      const profitShare = (partnerInvestment / totalPartnerInvestment) * commissionAmount;

      if (profitShare !== 0) {
        await usersRepo
          .createQueryBuilder()
          .update(UserEntity)
          .set({
            totalProfit: () => `"totalProfit" + ${profitShare}`,
          } as any)
          .where('id = :id', { id: partner.id })
          .execute();
      }
    }
  }
}
