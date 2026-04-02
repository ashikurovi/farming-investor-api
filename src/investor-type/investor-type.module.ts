import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorTypeService } from './investor-type.service';
import { InvestorTypeController } from './investor-type.controller';
import { InvestorTypeEntity } from './entities/investor-type.entity';

import { PartnerModule } from 'src/partner/partner.module';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorTypeEntity]), PartnerModule],
  controllers: [InvestorTypeController],
  providers: [InvestorTypeService],
})
export class InvestorTypeModule {}
