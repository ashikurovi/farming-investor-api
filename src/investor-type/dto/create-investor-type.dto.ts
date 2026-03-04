import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateInvestorTypeDto {
  @IsString()
  type: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}
