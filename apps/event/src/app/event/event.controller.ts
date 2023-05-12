import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { Prisma, Event } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaClientExceptionFilter } from '@ticket-app/database';
import { RpcValidationFilter } from './http-exception.filter';

@ApiTags('event')
@UseFilters(new PrismaClientExceptionFilter(), RpcValidationFilter)
@Controller({ path: 'events' })
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

  @UsePipes(new ValidationPipe())
  @MessagePattern({ cmd: 'createEvent' })
  async createEvent(data: CreateEventDto): Promise<Event> {
    return await this.eventService.createEvent(data);
  }

  @MessagePattern({ cmd: 'updateEvent' })
  async updateEvent(data: { where: Prisma.UserWhereUniqueInput; data: UpdateEventDto }): Promise<Event> {
    return this.eventService.updateEvent(data);
  }

  @MessagePattern({ cmd: 'removeEvent' })
  async removeEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.deleteEvent(data);
  }
}
