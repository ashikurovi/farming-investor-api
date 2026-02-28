import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity('tbl_glarry')
export class GlarryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
