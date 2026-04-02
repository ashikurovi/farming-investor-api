import { Repository } from 'typeorm';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { UpdateDailyReportDto } from './dto/update-daily-report.dto';
import { DailyReport } from './entities/daily-report.entity';
import { Project } from '../projects/entities/project.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InvestmentService } from '../investment/investment.service';
import { PartnerService } from 'src/partner/partner.service';
export declare class DailyReportService {
    private readonly dailyReportRepo;
    private readonly projectsRepo;
    private readonly usersRepo;
    private readonly investmentService;
    private readonly partnerService;
    constructor(dailyReportRepo: Repository<DailyReport>, projectsRepo: Repository<Project>, usersRepo: Repository<UserEntity>, investmentService: InvestmentService, partnerService: PartnerService);
    create(dto: CreateDailyReportDto): Promise<DailyReport>;
    findAll(): Promise<DailyReport[]>;
    findOne(id: number): Promise<DailyReport>;
    update(id: number, updateDailyReportDto: UpdateDailyReportDto): Promise<DailyReport>;
    remove(id: number): Promise<void>;
}
