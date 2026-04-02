import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class PartnerInvestDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;
}
