import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order: number;
}

