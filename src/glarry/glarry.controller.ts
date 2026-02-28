import {
  BadRequestException,
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
import { GlarryService } from './glarry.service';
import { CreateGlarryDto } from './dto/create-glarry.dto';
import { UpdateGlarryDto } from './dto/update-glarry.dto';

@Controller('glarry')
export class GlarryController {
  constructor(
    private readonly glarryService: GlarryService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGlarryDto: CreateGlarryDto,
  ) {
    if (file) {
      createGlarryDto.photoUrl =
        await this.blobStorageService.uploadGlarryPhoto(file);
    }
    if (!createGlarryDto.photoUrl) {
      throw new BadRequestException('Either photo file or photoUrl is required');
    }
    const glarry = await this.glarryService.create(createGlarryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Glarry created successfully',
      data: glarry,
    };
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('projectId') projectId?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.glarryService.findAll({
      page: pageNumber,
      limit: limitNumber,
      projectId: projectId ? +projectId : undefined,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Glarry list fetched successfully',
      data: result,
    };
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.glarryService.findByProject(+projectId, {
      page: pageNumber,
      limit: limitNumber,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Glarry images by project fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const glarry = await this.glarryService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Glarry fetched successfully',
      data: glarry,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateGlarryDto: UpdateGlarryDto,
  ) {
    const payload: UpdateGlarryDto & { photoUrl?: string } = { ...updateGlarryDto };
    if (file) {
      payload.photoUrl = await this.blobStorageService.uploadGlarryPhoto(file);
    }
    const glarry = await this.glarryService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Glarry updated successfully',
      data: glarry,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.glarryService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Glarry removed successfully',
    };
  }
}
