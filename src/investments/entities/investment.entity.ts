import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tbl_investments')
@Index(['userId', 'projectId'], { unique: true })
@Index(['userId', 'createdAt'])
@Index(['projectId', 'createdAt'])
export class InvestmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.investments, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.investments, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;
}
