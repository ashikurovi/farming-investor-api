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
} from '@nestjs/common';
import { ProjectPeriodService } from './project-period.service';
import { CreateProjectPeriodDto } from './dto/create-project-period.dto';
import { UpdateProjectPeriodDto } from './dto/update-project-period.dto';

@Controller('project-period')
export class ProjectPeriodController {
  constructor(private readonly projectPeriodService: ProjectPeriodService) {}

  @Post()
  async create(@Body() createProjectPeriodDto: CreateProjectPeriodDto) {
    const period =
      await this.projectPeriodService.create(createProjectPeriodDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project period created successfully',
      data: period,
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

    const result = await this.projectPeriodService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Project periods fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const period = await this.projectPeriodService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project period fetched successfully',
      data: period,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectPeriodDto: UpdateProjectPeriodDto,
  ) {
    const period = await this.projectPeriodService.update(
      +id,
      updateProjectPeriodDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Project period updated successfully',
      data: period,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.projectPeriodService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project period removed successfully',
    };
  }
}
