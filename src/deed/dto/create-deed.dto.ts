import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateDeedDto {
  @IsOptional()
  @IsNumber()
  investmentId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  uploadPdf?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  signature?: string;
}
