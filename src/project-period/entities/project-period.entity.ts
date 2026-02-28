import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('tbl_project_periods')
@Index(['startDate', 'endDate'])
export class ProjectPeriodEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  duration: string;

  @Column({ type: 'int', default: 0, nullable: true })
  periodDays?: number;

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @OneToMany('ProjectEntity', 'projectPeriod')
  projects: any[];
}
