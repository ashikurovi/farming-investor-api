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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DeedService } from './deed.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';

@Controller('deed')
export class DeedController {
  constructor(
    private readonly deedService: DeedService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'uploadPdf', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      file?: any[];
      uploadPdf?: any[];
      signature?: any[];
    },
    @Body() createDeedDto: CreateDeedDto,
  ) {
    if (files?.file?.[0]) {
      createDeedDto.file = await this.blobStorageService.uploadDeedFile(files.file[0]);
    }
    if (files?.uploadPdf?.[0]) {
      createDeedDto.uploadPdf = await this.blobStorageService.uploadDeedFile(files.uploadPdf[0]);
    }
    if (files?.signature?.[0]) {
      createDeedDto.signature = await this.blobStorageService.uploadDeedFile(files.signature[0]);
    }

    if (createDeedDto.investmentId) {
      createDeedDto.investmentId = Number(createDeedDto.investmentId);
    }

    const deed = await this.deedService.create(createDeedDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Deed created successfully',
      data: deed,
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

    const result = await this.deedService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Deeds fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const deed = await this.deedService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Deed fetched successfully',
      data: deed,
    };
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'uploadPdf', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      file?: any[];
      uploadPdf?: any[];
      signature?: any[];
    },
    @Body() updateDeedDto: UpdateDeedDto,
  ) {
    const payload: UpdateDeedDto = { ...updateDeedDto };

    if (files?.file?.[0]) {
      payload.file = await this.blobStorageService.uploadDeedFile(files.file[0]);
    }
    if (files?.uploadPdf?.[0]) {
      payload.uploadPdf = await this.blobStorageService.uploadDeedFile(files.uploadPdf[0]);
    }
    if (files?.signature?.[0]) {
      payload.signature = await this.blobStorageService.uploadDeedFile(files.signature[0]);
    }

    if (payload.investmentId) {
      payload.investmentId = Number(payload.investmentId);
    }

    const deed = await this.deedService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Deed updated successfully',
      data: deed,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deedService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Deed removed successfully',
    };
  }
}
