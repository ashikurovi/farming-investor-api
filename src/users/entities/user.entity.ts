import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvestorTypeEntity } from '../../investor-type/entities/investor-type.entity';

export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
}

@Entity('tbl_users')
@Index(['role'])
@Index(['isBanned'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalInvestment: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalProfit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INVESTOR })
  role: UserRole;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ name: 'investor_type_id', nullable: true })
  investorTypeId?: number;

  @ManyToOne(() => InvestorTypeEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'investor_type_id' })
  investorType?: InvestorTypeEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
