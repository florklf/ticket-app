import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { Prisma, Event } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaClientExceptionFilter } from '@ticket-app/database';
import { RpcValidationFilter, CreateEventDto, UpdateEventDto } from '@ticket-app/common';

@ApiTags('event')
@UseFilters(new PrismaClientExceptionFilter(), RpcValidationFilter)
@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'findEvent' })
  async findEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.event(data);
  }

  @MessagePattern({ cmd: 'findEvents' })
  async findAll(): Promise<Event[]> {
    return await this.eventService.events({});
  }

  @MessagePattern({ cmd: 'createEvent' })
  async createEvent(@Payload(new ValidationPipe()) data: CreateEventDto): Promise<Event> {
    return await this.eventService.createEvent(data);
  }

  @MessagePattern({ cmd: 'updateEvent' })
  async updateEvent(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data') data: UpdateEventDto): Promise<Event> {
    return this.eventService.updateEvent({where, data});
  }

  @MessagePattern({ cmd: 'removeEvent' })
  async removeEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.deleteEvent(data);
  }
}
