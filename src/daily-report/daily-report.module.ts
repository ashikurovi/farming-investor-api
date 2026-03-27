import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReportService } from './daily-report.service';
import { DailyReportController } from './daily-report.controller';
import { DailyReport } from './entities/daily-report.entity';
import { Project } from '../projects/entities/project.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InvestmentModule } from '../investment/investment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyReport, Project, UserEntity]),
    InvestmentModule,
  ],
  controllers: [DailyReportController],
  providers: [DailyReportService],
})
export class DailyReportModule {}
