import { GlarryEntity } from '../../glarry/entities/glarry.entity';
import { DailyReport } from '../../daily-report/entities/daily-report.entity';
export declare class Project {
    id: number;
    name: string;
    description?: string;
    photoUrl?: string;
    status: string;
    location?: string;
    totalCost: number;
    totalSell: number;
    totalProfit: number;
    totalInvestment: number;
    distributedProfit: number;
    glarry: GlarryEntity[];
    dailyReports: DailyReport[];
}
