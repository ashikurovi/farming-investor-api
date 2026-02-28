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
import * as Express from 'express';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    if (file) {
      createBannerDto.photoUrl =
        await this.blobStorageService.uploadBannerPhoto(file);
    }
    const banner = await this.bannerService.create(createBannerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Banner created successfully',
      data: banner,
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

    const result = await this.bannerService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Banners fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const banner = await this.bannerService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner fetched successfully',
      data: banner,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    const payload: UpdateBannerDto & { photoUrl?: string } = {
      ...updateBannerDto,
    };
    if (file) {
      payload.photoUrl =
        await this.blobStorageService.uploadBannerPhoto(file);
    }
    const banner = await this.bannerService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner updated successfully',
      data: banner,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.bannerService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner removed successfully',
    };
  }
}
