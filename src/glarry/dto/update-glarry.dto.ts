import { PartialType } from '@nestjs/mapped-types';
import { CreateGlarryDto } from './create-glarry.dto';

export class UpdateGlarryDto extends PartialType(CreateGlarryDto) {}
