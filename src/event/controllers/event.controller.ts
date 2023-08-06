import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateEventDto,
  OptionsQueryEvent,
  StatusEvent,
  UpdateEventDto,
} from '../dto/event.dto';
import { SuccessResponse } from 'src/utils/success';
import { convertStringToSlug } from 'src/utils/slug';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard())
  @Post()
  async createEvent(@Body() body: CreateEventDto, @Req() req: any) {
    const event = await this.eventService.createEvent({
      ...body,
      creator: req.user.username,
      link: convertStringToSlug(body.name),
    });
    return SuccessResponse.send('Create event successful', {
      eventId: event.id,
    });
  }
  @UseGuards(AuthGuard())
  @Get('event-joined')
  async getEventJoined(@Req() req: any) {
    const events = await this.eventService.getEventWasJoin(req.user.id);
    return SuccessResponse.send('Get events joined successful', {
      events,
    });
  }
  @Get('coming')
  async getEventsComing(@Query() query: OptionsQueryEvent) {
    const events = await this.eventService.getEventsComing(query);
    return SuccessResponse.send('Get list event successful', {
      events,
    });
  }
  @UseGuards(AuthGuard())
  @Get('my-event')
  async getMyEvents(@Req() req: any, @Query() query: OptionsQueryEvent) {
    const events = await this.eventService.getEvents({
      creator: req.user.username,
      ...query,
    });
    return SuccessResponse.send('Get list my event successful', {
      events,
    });
  }

  @Get(':slug')
  async getEvent(@Param() { slug }) {
    const event = await this.eventService.getEventBySlug(slug);
    const members = await this.eventService.getListMemberJoin(event.id);
    return SuccessResponse.send('Get event successful', {
      event,
      members,
    });
  }

  @Get('')
  async getEvents(@Query() query: OptionsQueryEvent) {
    const events = await this.eventService.getEvents(query);
    return SuccessResponse.send('Get list event successful', {
      events,
    });
  }

  @UseGuards(AuthGuard())
  @Patch(':eventId')
  async updateEvent(
    @Param() { eventId },
    @Body() body: UpdateEventDto,
    @Req() req: any,
  ) {
    console.log(body);

    const event = await this.eventService.updateEventById(eventId, {
      ...body,
      link: convertStringToSlug(body.name),
      creator: req.user.username,
    });
    return SuccessResponse.send('Update event successful', {
      eventId: event.id,
    });
  }

  @UseGuards(AuthGuard())
  @Delete(':eventId')
  async deleteEvent(@Param() { eventId }, @Req() req: any) {
    const event = await this.eventService.deleteEventById(
      eventId,
      req.user.username,
    );
    return SuccessResponse.send('Delete event successful', {
      eventId: event.id,
    });
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('approve/:eventId')
  async approveEvent(@Param() { eventId }) {
    const event = await this.eventService.approveEventById(eventId);
    return SuccessResponse.send('Approve event successful', {
      eventId: event.id,
    });
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('reject/:eventId')
  async rejectEvent(@Param() { eventId }) {
    const event = await this.eventService.cancelEventById(eventId);
    return SuccessResponse.send('Reject event successful', {
      eventId: event.id,
    });
  }
  @UseGuards(AuthGuard())
  @Post('join/:eventId')
  async joinEvent(@Param() { eventId }, @Req() req: any) {
    const event = await this.eventService.joinEvent(req.user, eventId);
    return SuccessResponse.send('Join event successful', {
      eventId: event.id,
    });
  }
  @UseGuards(AuthGuard())
  @Patch('cancel/:eventId')
  async cancelEvent(@Param() { eventId }, @Req() req: any) {
    const event = await this.eventService.cancelEvent(
      eventId,
      req.user.username,
    );
    return SuccessResponse.send('Cancel event successful', {
      eventId: event.id,
    });
  }
}
