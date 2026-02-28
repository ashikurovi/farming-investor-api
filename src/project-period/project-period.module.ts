import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPeriodService } from './project-period.service';
import { ProjectPeriodController } from './project-period.controller';
import { ProjectPeriodEntity } from './entities/project-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectPeriodEntity])],
  controllers: [ProjectPeriodController],
  providers: [ProjectPeriodService],
  exports: [ProjectPeriodService],
})
export class ProjectPeriodModule {}
