import { PartialType } from '@nestjs/mapped-types';
import { CreateDeedDto } from './create-deed.dto';

export class UpdateDeedDto extends PartialType(CreateDeedDto) {}
