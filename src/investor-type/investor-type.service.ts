import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorTypeEntity } from './entities/investor-type.entity';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';

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
