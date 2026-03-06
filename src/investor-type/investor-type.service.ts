import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorTypeEntity } from './entities/investor-type.entity';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';
import { Project } from 'src/projects/entities/project.entity';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';

export type InvestorTypeResponse = {
  id: number;
  type: string;
  percentage: number;
};

@Injectable()
export class InvestorTypeService {
  constructor(
    @InjectRepository(InvestorTypeEntity)
    private readonly investorTypeRepo: Repository<InvestorTypeEntity>,
  ) {}

  async create(
    createInvestorTypeDto: CreateInvestorTypeDto,
  ): Promise<InvestorTypeResponse> {
    const entity = this.investorTypeRepo.create({
      type: createInvestorTypeDto.type,
      percentage: createInvestorTypeDto.percentage,
    });
    const saved = await this.investorTypeRepo.save(entity);
    return this.findOne(saved.id);
  }

  async findAll(): Promise<InvestorTypeResponse[]> {
    const list = await this.investorTypeRepo.find({
      order: { id: 'DESC' },
    });
    return list.map((i) => this.toResponse(i));
  }

  async findOne(id: number): Promise<InvestorTypeResponse> {
    const entity = await this.investorTypeRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`InvestorType with id "${id}" not found`);
    }
    return this.toResponse(entity);
  }

  async update(
    id: number,
    updateInvestorTypeDto: UpdateInvestorTypeDto,
  ): Promise<InvestorTypeResponse> {
    const entity = await this.investorTypeRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`InvestorType with id "${id}" not found`);
    }
    if (updateInvestorTypeDto.type != null)
      entity.type = updateInvestorTypeDto.type;
    if (updateInvestorTypeDto.percentage != null)
      entity.percentage = updateInvestorTypeDto.percentage;
    const saved = await this.investorTypeRepo.save(entity);

    await this.investorTypeRepo.manager.transaction(async (manager) => {
      const projRepo = manager.getRepository(Project);
      const usersRepo = manager.getRepository(UserEntity);

      const raw = await projRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.distributedProfit), 0)', 'pool')
        .getRawOne<{ pool: string | number }>();
      const pool = raw?.pool != null ? Number(raw.pool) : 0;

      const users = await usersRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.investorType', 'investorType')
        .where('u.role = :role', { role: UserRole.INVESTOR })
        .andWhere('u.isBanned = :banned', { banned: false })
        .getMany();

      await usersRepo
        .createQueryBuilder()
        .update(UserEntity)
        .set({ totalProfit: 0 } as any)
        .where('role = :role', { role: UserRole.INVESTOR })
        .andWhere('isBanned = :banned', { banned: false })
        .execute();

      const totalInvest = users.reduce(
        (sum, u) => sum + Number(u.totalInvestment || 0),
        0,
      );

      if (pool > 0 && users.length > 0 && totalInvest > 0) {
        for (const u of users) {
          const share = Number(u.totalInvestment || 0) / totalInvest;
          const investorTypePercent =
            u.investorType && u.investorType.percentage != null
              ? Number(u.investorType.percentage)
              : 100;
          const pct = investorTypePercent / 100;
          const final = pool * share * pct;
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
      }
    });

    return this.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.investorTypeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`InvestorType with id "${id}" not found`);
    }
  }

  private toResponse(entity: InvestorTypeEntity): InvestorTypeResponse {
    return {
      id: entity.id,
      type: entity.type,
      percentage: Number(entity.percentage),
    };
  }
}
