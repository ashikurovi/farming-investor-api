import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlarryService } from './glarry.service';
import { GlarryController } from './glarry.controller';
import { GlarryEntity } from './entities/glarry.entity';
import { ProjectEntity } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlarryEntity,ProjectEntity])],
  controllers: [GlarryController],
  providers: [GlarryService],
})
export class GlarryModule {}
