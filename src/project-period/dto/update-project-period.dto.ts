import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectPeriodDto } from './create-project-period.dto';

export class UpdateProjectPeriodDto extends PartialType(CreateProjectPeriodDto) {}
