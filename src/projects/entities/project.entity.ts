import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GlarryEntity } from '../../glarry/entities/glarry.entity';

@Entity('tbl_project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => GlarryEntity, (glarry) => glarry.project, {
    cascade: true,
  })
  glarry: GlarryEntity[];
}
