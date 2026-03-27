import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Deed } from '../../deed/entities/deed.entity';

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

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Deed, (deed) => deed.investment)
  deeds: Deed[];
}
