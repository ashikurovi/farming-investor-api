import { ProjectEntity } from '../../projects/entities/project.entity';
import { UserEntity } from '../../users/entities/user.entity';
export declare class InvestmentEntity {
    id: number;
    userId: number;
    projectId: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
    project: ProjectEntity;
}
