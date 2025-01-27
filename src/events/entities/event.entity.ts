import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';
import { CreateEventMetadataDto } from '../dtos/create-event-metadata.dto';
import { EventType } from '../enums/event-type.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp' })
  endDateTime: Date;

  @Column({ length: 512 })
  location: string;

  @Column({ type: 'integer' })
  ticketPrice: number;

  @Column({ type: 'integer' })
  totalTickets: number;

  @Column({ type: 'enum', enum: EventType, default: EventType.OFFLINE })
  eventType: EventType;

  @Column({ length: 1024, nullable: true })
  imageUrl?: string;

  metadata?: CreateEventMetadataDto[];

  @ManyToOne(() => User, (user) => user.events)
  organizer: User;

  @ManyToMany(() => Tag, (tag) => tag.events)
  @JoinTable()
  tags?: Tag[];
}
