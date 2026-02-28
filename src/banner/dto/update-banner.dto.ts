import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateBannerDto } from './create-banner.dto';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}
