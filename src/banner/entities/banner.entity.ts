import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_banners')
@Index(['order'])
@Index(['order', 'id'])
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ name: 'display_order', type: 'int' })
  order: number;
}

