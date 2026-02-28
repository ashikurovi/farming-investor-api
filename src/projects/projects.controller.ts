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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (file) {
      createProjectDto.image =
        await this.blobStorageService.uploadProjectImage(file);
    }
    const project = await this.projectsService.create(createProjectDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: project,
    };
  }

  @Get('stats')
  async getGlobalStats() {
    const stats = await this.projectsService.getGlobalStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Project stats fetched successfully',
      data: stats,
    };
  }

  @Get(':id/stats')
  async getProjectStats(@Param('id') id: string) {
    const stats = await this.projectsService.getProjectStats(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project stats fetched successfully',
      data: stats,
    };
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('status') status?: ProjectStatus,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);

    const result = await this.projectsService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
      status,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: result,
    };
  }

  @Get(':id/investment-info')
  async getInvestmentInfo(@Param('id') id: string) {
    const info = await this.projectsService.getInvestmentInfo(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment info fetched successfully',
      data: info,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data: project,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const payload: UpdateProjectDto & { image?: string } = {
      ...updateProjectDto,
    };
    if (file) {
      payload.image =
        await this.blobStorageService.uploadProjectImage(file);
    }
    const project = await this.projectsService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: project,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project removed successfully',
    };
  }
}
