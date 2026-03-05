import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';

@Controller('investment')
export class InvestmentController {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: any,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    if (file) {
      createInvestmentDto.photoUrl =
        await this.blobStorageService.uploadUserPhoto(file);
    }
    const data = await this.investmentService.create(createInvestmentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Investment created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.investmentService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Investments fetched successfully',
      data,
    };
  }

  @Get('recent')
  async recent() {
    const data = await this.investmentService.findRecent(5);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recent investments fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.investmentService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment fetched successfully',
      data,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    if (file) {
      updateInvestmentDto.photoUrl =
        await this.blobStorageService.uploadUserPhoto(file);
    }
    const data = await this.investmentService.update(+id, updateInvestmentDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.investmentService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment removed successfully',
    };
  }
}
