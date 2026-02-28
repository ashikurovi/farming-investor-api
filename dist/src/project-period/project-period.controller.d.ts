import { HttpStatus } from '@nestjs/common';
import { ProjectPeriodService } from './project-period.service';
import { CreateProjectPeriodDto } from './dto/create-project-period.dto';
import { UpdateProjectPeriodDto } from './dto/update-project-period.dto';
export declare class ProjectPeriodController {
    private readonly projectPeriodService;
    constructor(projectPeriodService: ProjectPeriodService);
    create(createProjectPeriodDto: CreateProjectPeriodDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project-period.entity").ProjectPeriodEntity;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/project-period.entity").ProjectPeriodEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project-period.entity").ProjectPeriodEntity;
    }>;
    update(id: string, updateProjectPeriodDto: UpdateProjectPeriodDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project-period.entity").ProjectPeriodEntity;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
