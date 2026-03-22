import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    if (file) {
      createNoticeDto.fileUrl = await this.blobStorageService.uploadNoticeFile(file);
    }
    const notice = await this.noticeService.create(createNoticeDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Notice created successfully',
      data: notice,
    };
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);

    const result = await this.noticeService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Notices fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const notice = await this.noticeService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice fetched successfully',
      data: notice,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    const payload: UpdateNoticeDto & { fileUrl?: string } = {
      ...updateNoticeDto,
    };
    if (file) {
      payload.fileUrl = await this.blobStorageService.uploadNoticeFile(file);
    }
    const notice = await this.noticeService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice updated successfully',
      data: notice,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.noticeService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice removed successfully',
    };
  }
}
