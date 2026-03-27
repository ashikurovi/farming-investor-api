import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { InvestamountModule } from '../investamount/investamount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, UserEntity]),
    UsersModule,
    InvestamountModule,
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
