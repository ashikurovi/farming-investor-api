import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestamountDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;
}
