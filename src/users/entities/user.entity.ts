import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
}

@Entity('tbl_users')
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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INVESTOR })
  role: UserRole;

  @Column({ default: false })
  isBanned: boolean;
}
