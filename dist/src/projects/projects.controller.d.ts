import { HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BlobStorageService } from '../uploads/blob-storage.service';
export declare class ProjectsController {
    private readonly projectsService;
    private readonly blobStorageService;
    constructor(projectsService: ProjectsService, blobStorageService: BlobStorageService);
    create(file: any, createProjectDto: CreateProjectDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").Project;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").Project[];
    }>;
    getStats(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            totalProjects: number;
            totalInvestment: number;
            totalSell: number;
            totalCost: number;
            totalProfit: number;
            activeInvestors: number;
            avgYieldPercent: number;
            investorTotalInvestment: number;
            partnerTotalInvestment: number;
            moduleCounts?: Record<string, number>;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").Project;
    }>;
    update(id: string, file: any, updateProjectDto: UpdateProjectDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").Project;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
