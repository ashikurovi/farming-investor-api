import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { GlarryEntity } from 'src/glarry/entities/glarry.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DistributeProfitDto } from './dto/distribute-profit.dto';
import { PartnerService } from 'src/partner/partner.service';
export declare class ProjectsService implements OnModuleInit {
    private readonly projectsRepo;
    private readonly glarryRepo;
    private readonly usersRepo;
    private readonly partnerService;
    constructor(projectsRepo: Repository<Project>, glarryRepo: Repository<GlarryEntity>, usersRepo: Repository<UserEntity>, partnerService: PartnerService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: number): Promise<void>;
    getStats(): Promise<{
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
    }>;
    distributeAllProfit(dto: DistributeProfitDto): Promise<{
        pool: number;
        totalWithheld: number;
        totalDistributed: number;
        items: Array<{
            userId: number;
            share: number;
            base: number;
            investorTypePercent: number;
            final: number;
            withheld: number;
        }>;
    }>;
    onModuleInit(): Promise<void>;
}
