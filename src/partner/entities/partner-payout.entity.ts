import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('partner_payouts')
export class PartnerPayout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'partner_id' })
  partnerId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partner_id' })
  partner: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  reference: string;

  @CreateDateColumn()
  createdAt: Date;
}
