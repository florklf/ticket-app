import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe } from '@nestjs/common';
import { Event } from '@ticket-app/database';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, UpdateEventDto } from '@ticket-app/common';

@Controller('events')
@ApiTags('events')
export class EventController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEvent' }, { id: +id }));
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEvents' }, {}));
  }

  @Post()
  @ApiBody({ type: CreateEventDto })
  async create(@Body(new ValidationPipe) createEventDto: CreateEventDto): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'createEvent' }, createEventDto));
  }

  @Patch(':id')
  @ApiBody({ type: UpdateEventDto })
  async update(@Param('id') id: string, @Body(new ValidationPipe) updateEventDto: UpdateEventDto): Promise<Event> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateEvent' },
        {
          where: { id: +id },
          data: updateEventDto,
        }
      )
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeEvent' }, { id: +id }));
  }
}
