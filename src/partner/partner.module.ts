import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { UserEntity } from '../users/entities/user.entity';
import { Investment } from '../investment/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Investment])],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
