import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('investor_payouts')
export class InvestorPayout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'investor_id' })
  investorId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investor_id' })
  investor: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalInvestment: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalProfit: number;

  @Column({ nullable: true })
  reference: string;

  @CreateDateColumn()
  createdAt: Date;
}
