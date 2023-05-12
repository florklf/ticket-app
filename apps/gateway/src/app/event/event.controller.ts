import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Prisma, Event } from '@ticket-app/database';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('events')
@ApiTags('events')
@UseFilters(CustomExceptionFilter)
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
  async create(@Body() createEventDto: Prisma.EventCreateInput): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'createEvent' }, createEventDto));
  }

  @Patch(':id')
  async update(@Param() id: string, @Body() updateEventDto: Prisma.EventUpdateInput): Promise<Event> {
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
