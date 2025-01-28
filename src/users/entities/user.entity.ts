import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 100, nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  @Exclude()
  googleId?: string;

  @Column({ type: 'enum', array: true, enum: Role, default: [Role.USER] })
  roles: Role[];

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
