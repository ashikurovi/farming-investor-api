import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class UpdateInvestmentDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'Investment amount must be greater than 0' })
  amount: number;
}

