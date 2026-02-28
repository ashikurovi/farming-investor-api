import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  async invest(@Body() createInvestmentDto: CreateInvestmentDto) {
    const investment = await this.investmentsService.invest(
      createInvestmentDto.userId,
      createInvestmentDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Investment successful',
      data: investment,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.investmentsService.getStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment stats fetched successfully',
      data: stats,
    };
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.investmentsService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
      projectId: projectId ? +projectId : undefined,
      userId: userId ? +userId : undefined,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Investments fetched successfully',
      data: result,
    };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async myInvestments(
    @CurrentUser('sub') userId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.investmentsService.findAllByUser(userId, {
      page: pageNumber,
      limit: limitNumber,
      search,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Investments fetched successfully',
      data: result,
    };
  }

  @Get('project/:projectId/investors')
  async getInvestorsByProject(
    @Param('projectId') projectId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.investmentsService.getInvestorsByProject(
      +projectId,
      { page: pageNumber, limit: limitNumber, search },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Investors list (who invested how much) fetched successfully',
      data: result,
    };
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const result = await this.investmentsService.findAllByProject(+projectId, {
      page: pageNumber,
      limit: limitNumber,
      search,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Project investments fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const investment = await this.investmentsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment fetched successfully',
      data: investment,
    };
  }

  @Delete(':id')

  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser('sub') userId: number) {
    await this.investmentsService.remove(+id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment removed successfully',
    };
  }
}
