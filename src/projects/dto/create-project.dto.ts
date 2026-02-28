import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  totalPrice: number;

  /** Minimum amount (in BDT or project currency) required per investment */
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minInvestmentAmount?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  profitPercentage: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectPeriodId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
