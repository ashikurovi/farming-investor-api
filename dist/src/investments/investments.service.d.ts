import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentEntity } from './entities/investment.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { UserEntity } from 'src/users/entities/user.entity';
export declare class InvestmentsService {
    private readonly investmentRepository;
    private readonly projectRepository;
    private readonly userRepository;
    private readonly projectsService;
    constructor(investmentRepository: Repository<InvestmentEntity>, projectRepository: Repository<ProjectEntity>, userRepository: Repository<UserEntity>, projectsService: ProjectsService);
    invest(userId: number, createInvestmentDto: CreateInvestmentDto): Promise<InvestmentEntity>;
    findAllByUser(userId: number, options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: InvestmentEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findAllByProject(projectId: number, options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: InvestmentEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    getInvestorsByProject(projectId: number, options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        investors: {
            userId: number;
            name: string;
            email: string;
            phone: string;
            amount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
        projectId?: number;
        userId?: number;
    }): Promise<{
        items: InvestmentEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    getStats(): Promise<{
        totalInvestments: number;
        totalAmountInvested: number;
        uniqueInvestors: number;
        uniqueProjectsInvested: number;
    }>;
    findOne(id: number): Promise<InvestmentEntity>;
    remove(id: number, userId?: number): Promise<void>;
}
