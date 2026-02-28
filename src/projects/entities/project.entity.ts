import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvestmentEntity } from '../../investments/entities/investment.entity';
import { ProjectPeriodEntity } from '../../project-period/entities/project-period.entity';

export enum ProjectStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('tbl_projects')
@Index(['status'])
@Index(['startDate', 'endDate'])
@Index(['createdAt'])
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalPrice: number;

  /** Minimum amount required per investment for this project */
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  minInvestmentAmount: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  collectedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  profitPercentage: number;

  @ManyToOne(() => ProjectPeriodEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_period_id' })
  projectPeriod: ProjectPeriodEntity;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.OPEN })
  status: ProjectStatus;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InvestmentEntity, (inv) => inv.project)
  investments: InvestmentEntity[];
}
