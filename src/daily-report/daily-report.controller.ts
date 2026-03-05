import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DailyReportService } from './daily-report.service';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { UpdateDailyReportDto } from './dto/update-daily-report.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';

@Controller('daily-report')
export class DailyReportController {
  constructor(
    private readonly dailyReportService: DailyReportService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: any,
    @Body() createDailyReportDto: CreateDailyReportDto,
  ) {
    if (file) {
      createDailyReportDto.photoUrl =
        await this.blobStorageService.uploadProjectImage(file);
    }
    const data = await this.dailyReportService.create(createDailyReportDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Daily report created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.dailyReportService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Daily reports fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.dailyReportService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Daily report fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDailyReportDto: UpdateDailyReportDto,
  ) {
    const data = await this.dailyReportService.update(
      +id,
      updateDailyReportDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Daily report updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.dailyReportService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Daily report removed successfully',
    };
  }
}
