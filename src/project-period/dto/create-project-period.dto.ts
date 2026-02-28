import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectPeriodDto {
  @IsString()
  @IsNotEmpty()
  duration: string;
}
