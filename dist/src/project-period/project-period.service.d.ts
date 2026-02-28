import { Repository } from 'typeorm';
import { CreateProjectPeriodDto } from './dto/create-project-period.dto';
import { UpdateProjectPeriodDto } from './dto/update-project-period.dto';
import { ProjectPeriodEntity } from './entities/project-period.entity';
export declare class ProjectPeriodService {
    private readonly projectPeriodRepository;
    constructor(projectPeriodRepository: Repository<ProjectPeriodEntity>);
    create(createProjectPeriodDto: CreateProjectPeriodDto): Promise<ProjectPeriodEntity>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: ProjectPeriodEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number): Promise<ProjectPeriodEntity>;
    update(id: number, updateProjectPeriodDto: UpdateProjectPeriodDto): Promise<ProjectPeriodEntity>;
    remove(id: number): Promise<void>;
}
