import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('tbl_daily_reports')
export class DailyReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  dailyCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  dailySell: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;
}
