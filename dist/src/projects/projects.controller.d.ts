import { HttpStatus } from '@nestjs/common';
import * as Express from 'express';
import { BlobStorageService } from '../uploads/blob-storage.service';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';
export declare class ProjectsController {
    private readonly projectsService;
    private readonly blobStorageService;
    constructor(projectsService: ProjectsService, blobStorageService: BlobStorageService);
    create(file: Express.Multer.File, createProjectDto: CreateProjectDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").ProjectEntity;
    }>;
    getGlobalStats(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            totalProjects: number;
            openProjects: number;
            closedProjects: number;
            totalTargetAmount: number;
            totalCollectedAmount: number;
            totalRemainingAmount: number;
            totalInvestors: number;
        };
    }>;
    getProjectStats(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            projectId: number;
            title: string;
            status: ProjectStatus;
            totalTargetAmount: number;
            collectedAmount: number;
            remainingAmount: number;
            progressPercent: number;
            investorCount: number;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, status?: ProjectStatus): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/project.entity").ProjectEntity[];
            meta: {
                total: number;
                page: number;
                limit: number;
                pageCount: number;
            };
        };
    }>;
    getInvestmentInfo(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            projectId: number;
            minInvestmentAmount: number;
            totalPrice: number;
            collectedAmount: number;
            remainingAmount: number;
            status: ProjectStatus;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").ProjectEntity;
    }>;
    update(id: string, file: Express.Multer.File, updateProjectDto: UpdateProjectDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/project.entity").ProjectEntity;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
