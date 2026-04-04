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
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (file) {
      createProjectDto.photoUrl =
        await this.blobStorageService.uploadProjectImage(file);
    }
    const data = await this.projectsService.create({
      ...createProjectDto,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.projectsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data,
    };
  }

  @Public()
  @Get('stats')
  async getStats() {
    const data = await this.projectsService.getStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Project stats fetched successfully',
      data,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.projectsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const payload: UpdateProjectDto & { photoUrl?: string } = {
      ...updateProjectDto,
    };
    if (file) {
      payload.photoUrl = await this.blobStorageService.uploadProjectImage(file);
    }
    const data = await this.projectsService.update(+id, payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project removed successfully',
    };
  }

  // Removed manual profit distribution endpoint in favor of real-time auto distribution
}
