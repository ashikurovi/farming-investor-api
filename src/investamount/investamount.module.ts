import { Module } from '@nestjs/common';
import { InvestamountService } from './investamount.service';
import { InvestamountController } from './investamount.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Investamount } from './entities/investamount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investamount])],
  controllers: [InvestamountController],
  providers: [InvestamountService],
  exports: [InvestamountService],
})
export class InvestamountModule {}
