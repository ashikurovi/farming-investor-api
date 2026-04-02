import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { UserEntity } from '../users/entities/user.entity';
import { Investment } from '../investment/entities/investment.entity';
import { PartnerPayout } from './entities/partner-payout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Investment, PartnerPayout])],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
