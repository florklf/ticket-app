import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Query } from '@nestjs/common';
import { Event, EventSeatType } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, FindEventsDto, UpdateEventDto } from '@ticket-app/common';

@Controller('events')
@ApiTags('events')
export class EventController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get('concerts')
  async findAllConcerts(): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findConcerts' }, {})
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get('count')
  async countEvents(@Query(new ValidationPipe({transform:true})) query: FindEventsDto): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'countEvents' }, {
      type: query.type ?? undefined,
      genre: {
        name: query.genre ?? undefined,
      },
    })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEvent' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({transform:true})) query: FindEventsDto): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEvents' }, {
      take: query.limit ?? undefined,
      skip: (query.page && query.limit) ? query.page * query.limit : undefined,
      where: {
        type: query.type ?? undefined,
        genre: {
          name: query.genre ?? undefined,
        },
      },
    })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post()
  @ApiBody({ type: CreateEventDto })
  async create(@Body(new ValidationPipe) createEventDto: CreateEventDto): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'createEvent' }, createEventDto)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
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
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Event> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeEvent' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get('seat-types/:id')
  async findEventSeatTypeForSnipcart(@Param('id') id: string): Promise<EventSeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEventSeatTypeForSnipcart' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
