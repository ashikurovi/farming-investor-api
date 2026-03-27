import { PartialType } from '@nestjs/swagger';
import { CreateInvestmentDto } from './create-investment.dto';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateInvestmentDto extends PartialType(CreateInvestmentDto) {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
