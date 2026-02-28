import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @Type(() => Number)
  @IsInt()
  userId: number;

  @Type(() => Number)
  @IsInt()
  projectId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'Investment amount must be greater than 0' })
  amount: number;
}
