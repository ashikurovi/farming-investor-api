import { Project } from '../../projects/entities/project.entity';
export declare class DailyReport {
    id: number;
    projectId: number;
    project: Project;
    dailyCost: number;
    dailySell: number;
    reason?: string;
    photoUrl?: string;
    date: string;
    time: string;
}
