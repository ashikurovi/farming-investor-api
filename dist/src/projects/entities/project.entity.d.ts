import { InvestmentEntity } from '../../investments/entities/investment.entity';
import { ProjectPeriodEntity } from '../../project-period/entities/project-period.entity';
export declare enum ProjectStatus {
    OPEN = "open",
    CLOSED = "closed"
}
export declare class ProjectEntity {
    id: number;
    title: string;
    description: string;
    image?: string;
    totalPrice: number;
    minInvestmentAmount: number;
    collectedAmount: number;
    profitPercentage: number;
    projectPeriod: ProjectPeriodEntity;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    createdAt: Date;
    updatedAt: Date;
    investments: InvestmentEntity[];
}
