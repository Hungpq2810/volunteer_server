import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Like, Raw, Repository } from 'typeorm';
import {
  CreateEventDto,
  OptionsQueryEvent,
  StatusEvent,
  UpdateEventDto,
} from '../dto/event.dto';
import { User } from 'src/user/entities/user.entity';
import { EventVolunteer } from '../entities/eventVolunteer.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventVolunteer)
    private eventVolunteerRepository: Repository<EventVolunteer>,
  ) {}

  async createEvent(body: CreateEventDto) {
    return this.eventRepository.save(body);
  }
  async getListMemberJoin(eventId: string) {
    return await this.eventVolunteerRepository
      .createQueryBuilder('event_volunteer')
      .leftJoinAndMapOne(
        'event_volunteer.event',
        Event,
        'event',
        'event_volunteer.eventId = event.id',
      )
      .leftJoinAndMapOne(
        'event_volunteer.user',
        User,
        'user',
        'event_volunteer.userId = user.id',
      )
      .where('event_volunteer.eventId = :eventId', { eventId: eventId })
      .select(['event_volunteer.id'])
      .addSelect([
        'user.id',
        'user.username',
        'user.name',
        'user.email',
        'user.phoneNumber',
      ])
      .getMany();
  }
  async getEventById(eventId: string) {
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    delete event.deletedAt;
    return event;
  }
  async getEventBySlug(slug: string) {
    const event = await this.eventRepository.findOneBy({ link: slug });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    delete event.deletedAt;
    return event;
  }
  async getEvents(query: OptionsQueryEvent) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const skip = (page - 1) * limit;
    const [res, total] = await this.eventRepository.findAndCount({
      where: {
        category: query.category ? Like('%' + query.category + '%') : null,
        location: query.location ? Like('%' + query.location + '%') : null,
        name: query.name ? Like('%' + query.name + '%') : null,
        creator: query.creator ? query.creator : null,
        status: query.status ? query.status : null,
        startDate: query.startDate
          ? Raw((alias) => `${alias} >= :start_date`, {
              start_date: query.startDate,
            })
          : null,
        endDate: query.endDate
          ? Raw((alias) => `${alias} <= :date`, {
              date: new Date(query.endDate),
            })
          : null,
      },
      take: limit,
      skip: skip,
      select: [
        'id',
        'name',
        'image',
        'description',
        'creator',
        'link',
        'location',
        'volunteers',
        'maxVolunteers',
        'createdAt',
        'updatedAt',
        'startDate',
        'endDate',
        'status',
      ],
    });
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currenPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
  async getEventsComing(query: OptionsQueryEvent) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const skip = (page - 1) * limit;
    const [res, total] = await this.eventRepository.findAndCount({
      where: {
        category: query.category ? Like('%' + query.category + '%') : null,
        location: query.location ? Like('%' + query.location + '%') : null,
        name: query.name ? Like('%' + query.name + '%') : null,
        creator: query.creator ? query.creator : null,
        status: 'APPROVED',
        startDate: query.startDate
          ? Raw((alias) => `${alias} >= :start_date`, {
              start_date: query.startDate,
            })
          : null,
        endDate: Raw((alias) => `${alias} >= :date`, {
          date: new Date(),
        }),
      },
      take: limit,
      skip: skip,
      select: [
        'id',
        'name',
        'image',
        'description',
        'creator',
        'link',
        'location',
        'volunteers',
        'maxVolunteers',
        'createdAt',
        'updatedAt',
        'startDate',
        'endDate',
        'status',
      ],
    });
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currenPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
  async updateEventById(eventId: string, body: UpdateEventDto) {
    const event = await this.getEventById(eventId);
    if (body.creator !== event.creator) {
      throw new ForbiddenException();
    }
    this.eventRepository.update(eventId, body);
    return event;
  }
  async deleteEventById(eventId: string, username: string) {
    const event = await this.getEventById(eventId);
    if (username !== event.creator) {
      throw new ForbiddenException();
    }
    this.eventRepository.softDelete(eventId);
    return event;
  }
  async approveEventById(eventId: string) {
    const event = await this.getEventById(eventId);
    if (event.status !== StatusEvent.PENDING) {
      throw new BadRequestException(
        `event was ${String(event.status).toLowerCase()}`,
      );
    }
    this.eventRepository.update(eventId, { status: StatusEvent.APPROVED });
    return event;
  }
  async cancelEventById(eventId: string) {
    const event = await this.getEventById(eventId);
    if (event.status === StatusEvent.REJECT) {
      throw new BadRequestException(
        `event was ${String(event.status).toLowerCase()}`,
      );
    }
    this.eventRepository.update(eventId, { status: StatusEvent.REJECT });
    return event;
  }
  async cancelEvent(eventId: string, username: string) {
    const event = await this.getEventById(eventId);
    if (event.status === StatusEvent.REJECT) {
      throw new BadRequestException(
        `event was ${String(event.status).toLowerCase()}`,
      );
    }
    if (event.creator !== username) {
      throw new ForbiddenException();
    }
    this.eventRepository.update(eventId, { status: StatusEvent.REJECT });
    return event;
  }
  async joinEvent(user: User, eventId: string) {
    const event = await this.getEventById(eventId);
    if (event.status !== StatusEvent.APPROVED) {
      throw new BadRequestException(`Event has not been approved`);
    }
    if (event.creator === user.username) {
      throw new BadRequestException(`You can't join your own event`);
    }
    if (event.maxVolunteers <= event.volunteers) {
      throw new BadRequestException(`Enough members to join this event`);
    }
    const isJoined = await this.eventVolunteerRepository.findOneBy({
      eventId: eventId,
      userId: user.id,
    });

    if (isJoined) {
      throw new BadRequestException(`You joined this event`);
    }
    this.eventVolunteerRepository.save({
      userId: user.id,
      eventId: eventId,
    });
    const newVolunteers = Number(event.volunteers) + 1;
    this.eventRepository.update(eventId, { volunteers: newVolunteers });
    return event;
  }
  async getEventWasJoin(userId: string) {
    const events = await this.eventVolunteerRepository
      .createQueryBuilder('event_volunteer')
      .leftJoinAndMapOne(
        'event_volunteer.event',
        Event,
        'event',
        'event_volunteer.eventId = event.id',
      )
      .leftJoinAndMapOne(
        'event_volunteer.user',
        User,
        'user',
        'event_volunteer.userId = user.id',
      )
      .where('event_volunteer.userId = :userId', { userId: userId })
      .select(['event_volunteer.id'])
      .addSelect([
        'event.id',
        'event.name',
        'event.image',
        'event.creator',
        'event.description',
        'event.category',
        'event.location',
        'event.volunteers',
        'event.maxVolunteers',
        'event.link',
        'event.status',
        'event.startDate',
        'event.endDate',
        'event.createdAt',
        'user.id',
        'user.username',
        'user.name',
        'user.email',
        'user.phoneNumber',
      ])
      .getMany();
    return events;
  }
}
// event_volunteer
