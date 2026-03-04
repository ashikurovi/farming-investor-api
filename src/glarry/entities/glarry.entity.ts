import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('tbl_glarry')
export class GlarryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @ManyToOne(() => Project, (project) => project.glarry, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
