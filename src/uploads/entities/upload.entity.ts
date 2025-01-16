import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from '../enums/file-types.enum';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  name: string;

  @Column({ length: 1024 })
  path: string;

  @Column({ type: 'enum', enum: FileTypes, default: FileTypes.IMAGE })
  type: string;

  @Column({ length: 128 })
  mimeType: string;

  @Column({ type: 'integer' })
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
