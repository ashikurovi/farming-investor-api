import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestamountDto } from './create-investamount.dto';

export class UpdateInvestamountDto extends PartialType(CreateInvestamountDto) {}
