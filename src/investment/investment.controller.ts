import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller(['investment', 'investments'])
export class InvestmentController {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly usersService: UsersService,
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

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async my(
    @CurrentUser('sub') userId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const data = await this.usersService.investmentsWithStats(userId, {
      page: pageNumber,
      limit: limitNumber,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'My investments fetched successfully',
      data,
    };
  }

  @Get('stats')
  async getStats() {
    const data = await this.investmentService.stats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment stats fetched successfully',
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
