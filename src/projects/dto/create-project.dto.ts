import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalSell?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalProfit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalInvestment?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
