import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';
import { InvestmentEntity } from 'src/investments/entities/investment.entity';
import { ProjectPeriodEntity } from 'src/project-period/entities/project-period.entity';
import { ProjectPeriodModule } from 'src/project-period/project-period.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, ProjectPeriodEntity, InvestmentEntity]),
    ProjectPeriodModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
