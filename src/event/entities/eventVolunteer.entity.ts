import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventVolunteer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  userId: string;
}
