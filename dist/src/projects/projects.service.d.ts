import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity, ProjectStatus } from './entities/project.entity';
import { ProjectPeriodService } from 'src/project-period/project-period.service';
import { InvestmentEntity } from 'src/investments/entities/investment.entity';
export declare class ProjectsService {
    private readonly projectRepository;
    private readonly investmentRepository;
    private readonly projectPeriodService;
    constructor(projectRepository: Repository<ProjectEntity>, investmentRepository: Repository<InvestmentEntity>, projectPeriodService: ProjectPeriodService);
    create(createProjectDto: CreateProjectDto): Promise<ProjectEntity>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: ProjectStatus;
    }): Promise<{
        items: ProjectEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number, loadInvestments?: boolean): Promise<ProjectEntity>;
    findOneForUpdate(id: number): Promise<ProjectEntity>;
    getGlobalStats(): Promise<{
        totalProjects: number;
        openProjects: number;
        closedProjects: number;
        totalTargetAmount: number;
        totalCollectedAmount: number;
        totalRemainingAmount: number;
        totalInvestors: number;
    }>;
    getProjectStats(projectId: number): Promise<{
        projectId: number;
        title: string;
        status: ProjectStatus;
        totalTargetAmount: number;
        collectedAmount: number;
        remainingAmount: number;
        progressPercent: number;
        investorCount: number;
    }>;
    getInvestmentInfo(projectId: number): Promise<{
        projectId: number;
        minInvestmentAmount: number;
        totalPrice: number;
        collectedAmount: number;
        remainingAmount: number;
        status: ProjectStatus;
    }>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity>;
    remove(id: number): Promise<void>;
    incrementCollectedAmount(projectId: number, amount: number): Promise<ProjectEntity>;
    decrementCollectedAmount(projectId: number, amount: number): Promise<ProjectEntity>;
}
