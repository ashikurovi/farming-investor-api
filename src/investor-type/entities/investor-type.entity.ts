import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_investor_types')
export class InvestorTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type_name' })
  type: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;
}
