import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, unique: true })
  name: string;

  // @Column({ length: 256, unique: true })
  // slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 1024, nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Event, (event) => event.tags, { onDelete: 'CASCADE' })
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
