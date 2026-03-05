import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GlarryEntity } from '../../glarry/entities/glarry.entity';
import { DailyReport } from '../../daily-report/entities/daily-report.entity';

@Entity('tbl_project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalSell: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalProfit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalInvestment: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  distributedProfit: number;

  @OneToMany(() => GlarryEntity, (glarry) => glarry.project, {
    cascade: true,
  })
  glarry: GlarryEntity[];

  @OneToMany(() => DailyReport, (report) => report.project, {
    cascade: false,
  })
  dailyReports: DailyReport[];
}
