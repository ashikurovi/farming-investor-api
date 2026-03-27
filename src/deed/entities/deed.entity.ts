import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Investment } from '../../investment/entities/investment.entity';

@Entity('tbl_deeds')
export class Deed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'investment_id', nullable: true })
  investmentId: number;

  @ManyToOne(() => Investment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investment_id' })
  investment: Investment;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  file: string;

  @Column({ name: 'upload_pdf', nullable: true })
  uploadPdf: string;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: string;

  @Column({ nullable: true })
  signature: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
