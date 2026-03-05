import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tbl_investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'investor_id', nullable: true })
  investorId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investor_id' })
  investor: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'time', nullable: true })
  time?: string;
}
