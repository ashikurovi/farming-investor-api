import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGlarryDto {
  @Type(() => Number)
  @IsNumber()
  projectId: number;

  /** Photo URL (optional if uploading file as "photo") */
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
