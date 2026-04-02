import { IsNumber, Min } from 'class-validator';

export class WithdrawProfitDto {
  @IsNumber()
  @Min(0.01)
  amount: number;
}
