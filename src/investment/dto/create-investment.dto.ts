import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateInvestmentDto {
  @Type(() => Number)
  @IsNumber()
  investorId: number;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
