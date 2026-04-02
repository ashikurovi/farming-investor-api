import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { GlarryEntity } from 'src/glarry/entities/glarry.entity';
import { DailyReport } from 'src/daily-report/entities/daily-report.entity';
import { UserEntity } from 'src/users/entities/user.entity';

import { PartnerModule } from 'src/partner/partner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, GlarryEntity, DailyReport, UserEntity]),
    PartnerModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
