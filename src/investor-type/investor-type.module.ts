import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorTypeService } from './investor-type.service';
import { InvestorTypeController } from './investor-type.controller';
import { InvestorTypeEntity } from './entities/investor-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorTypeEntity])],
  controllers: [InvestorTypeController],
  providers: [InvestorTypeService],
})
export class InvestorTypeModule {}
