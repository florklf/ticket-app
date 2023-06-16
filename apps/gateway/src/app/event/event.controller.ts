import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { Event, EventSeatType } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, CreateEventSeatTypeDto, FindEventsDto, UpdateEventDto, UpdateEventSeatTypeDto } from '@ticket-app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { Multer } from 'multer';

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
      type: {
        name: query.type ?? undefined,
      },
      eventGenres: {
        some: {
          genre: {
            name: query.genre ?? undefined,
          },
        },
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
        type: {
          name: query.type ?? undefined,
        },
        eventGenres:  {
          some: {
            genre: {
              name: query.genre ?? undefined,
            },
          },
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

  @Post('seat-types')
  @ApiBody({ type: CreateEventSeatTypeDto })
  async createEventSeatType(@Body(new ValidationPipe) eventSeatType: EventSeatType): Promise<EventSeatType> {
    console.log(eventSeatType)
    return await lastValueFrom(await this.client.send({ cmd: 'createEventSeatType' }, eventSeatType)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch('seat-types/:id')
  @ApiBody({ type: UpdateEventSeatTypeDto })
  async updateEventSeatType(@Param('id') id: string, @Body(new ValidationPipe) eventSeatType: EventSeatType): Promise<EventSeatType> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateEventSeatType' },
        {
          where: { id: +id },
          data: eventSeatType,
        }
      )
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete('seat-types/:id')
  async removeEventSeatType(@Param('id') id: string): Promise<EventSeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeEventSeatType' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 100000 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
      ]
    })
  ) file: Express.Multer.File, @Param('id') id: string) {
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
    const imageData = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
      }).then(res => res.json());

    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateEvent' },
        {
          where: { id: +id },
          data: { image: imageData.data.url },
        }
      )
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post('ids')
  async findEventsByIds(@Query(new ValidationPipe({transform:true})) query: FindEventsDto, @Body('ids') ids: number[]): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findEvents' }, {
      take: query.limit ?? undefined,
      skip: (query.page && query.limit) ? query.page * query.limit : undefined,
      where: {
        id: {
          in: ids,
        },
      },
    })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
