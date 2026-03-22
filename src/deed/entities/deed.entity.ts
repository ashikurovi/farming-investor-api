import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tbl_deeds')
export class Deed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'investor_id', nullable: true })
  investorId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investor_id' })
  investor: UserEntity;

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
