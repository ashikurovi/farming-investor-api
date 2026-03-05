import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalInvestment?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalProfit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  balance?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  investorTypeId?: number;
}
