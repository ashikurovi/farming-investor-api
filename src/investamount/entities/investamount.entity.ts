import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_investamounts')
export class Investamount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: number;
}
