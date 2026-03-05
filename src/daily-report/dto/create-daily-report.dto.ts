import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateDailyReportDto {
  @Type(() => Number)
  @IsNumber()
  projectId: number;

  @Type(() => Number)
  @IsNumber()
  dailyCost: number;

  @Type(() => Number)
  @IsNumber()
  dailySell: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsString()
  time: string; // HH:mm:ss
}
