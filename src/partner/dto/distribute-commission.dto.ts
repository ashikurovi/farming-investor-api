import { IsNumber, Min } from 'class-validator';

export class DistributeCommissionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;
}
