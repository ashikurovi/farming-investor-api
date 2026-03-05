import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DistributeProfitDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;
}
