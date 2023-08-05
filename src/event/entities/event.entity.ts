import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CategoryEvent, StatusEvent } from '../dto/event.dto';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column()
  creator: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: CategoryEvent,
  })
  category: string;

  @Column()
  location: string;

  @Column({ default: 0 })
  volunteers: number;

  @Column()
  maxVolunteers: number;

  @Column()
  link: string;

  @Column({
    type: 'enum',
    enum: StatusEvent,
    default: StatusEvent.PENDING,
  })
  status: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
