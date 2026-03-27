import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investamount } from './entities/investamount.entity';
import { CreateInvestamountDto } from './dto/create-investamount.dto';
import { UpdateInvestamountDto } from './dto/update-investamount.dto';

@Injectable()
export class InvestamountService {
  constructor(
    @InjectRepository(Investamount)
    private readonly repo: Repository<Investamount>,
  ) {}

  async findFirst() {
    let item = await this.repo.findOne({ where: {} });
    if (!item) {
      item = this.repo.create({ amount: 0 });
      await this.repo.save(item);
    }
    return item;
  }

  async update(updateInvestamountDto: UpdateInvestamountDto) {
    const item = await this.findFirst();
    this.repo.merge(item, updateInvestamountDto);
    return this.repo.save(item);
  }
}
