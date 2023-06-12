import { Controller, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { Prisma, Event, EnumEventType } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto } from '@ticket-app/common';
import { EventSeatTypeService } from './event-seat-type.service';
import { Express } from 'express'
import { Multer } from 'multer';
@ApiTags('event')
@Controller()
export class EventController {
  constructor(private readonly eventService: EventService, private readonly eventSeatTypeService: EventSeatTypeService) {}

  @MessagePattern({ cmd: 'findEvent' })
  async findEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.event({
      where: data,
      include: {
        place: true,
        EventSeatType: {
          include: {
            seatType: true
          }
        },
        eventGenres: {
          include: {
            genre: true,
          }
        },
        eventArtists: {
          include: {
            artist: true,
          }
        }
      },
    });
  }

  @MessagePattern({ cmd: 'findEvents' })
  async findAll(params: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.EventOrderByWithRelationInput;
    where?: Prisma.EventWhereInput;
  }): Promise<Event[]> {
    const { skip, take, orderBy, where } = params;

    return await this.eventService.events({
      orderBy: orderBy ?? {
        date: 'asc'
      },
      include: {
        place: true,
        EventSeatType: {
          include: {
            seatType: true
          }
        },
        eventGenres: {
          include: {
            genre: true,
          }
        },
        eventArtists: {
          include: {
            artist: true,
          }
        }
      },
      take,
      skip,
      where
    });
  }

  @MessagePattern({ cmd: 'countEvents' })
  async countEvents(data: Prisma.EventWhereInput): Promise<number> {
    return await this.eventService.countEvents(data);
  }

  @MessagePattern({ cmd: 'findConcerts' })
  async findAllConcerts(): Promise<Event[]> {
    return await this.eventService.events({
      where: {
        type: EnumEventType.CONCERT,
      },
      include: {
        place: true
      },
      orderBy: {
        date: 'asc'
      },
    });
  }

  @MessagePattern({ cmd: 'createEvent' })
  async createEvent(@Payload(new ValidationPipe()) data: CreateEventDto): Promise<Event> {
    return await this.eventService.createEvent(data);
  }

  @MessagePattern({ cmd: 'updateEvent' })
  async updateEvent(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data') data: UpdateEventDto): Promise<Event> {
    return await this.eventService.updateEvent({where, data});
  }

  @MessagePattern({ cmd: 'removeEvent' })
  async removeEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.deleteEvent(data);
  }

  @MessagePattern({ cmd: 'findEventSeatTypeForSnipcart' })
  async findEventSeatTypeForSnipcart(data: Prisma.EventWhereUniqueInput): Promise<any> {
    const eventSeatType = await this.eventSeatTypeService.eventSeatType({
      where: data,
    });
    return {
      id: eventSeatType.id.toString(),
      price: eventSeatType.price,
      url: `${process.env.EXPOSED_HOST}/events/seat-types/${eventSeatType.id.toString()}`,
      "customFields": [],
    }
  }

  @MessagePattern({ cmd: 'uploadImage' })
  async createImage({file, id}: {file: Express.Multer.File, id: number}): Promise<Event> {
    const event = await this.eventService.event({where: {id: id}});
    if (!event) {
      throw 'event not found';
    }
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
    const imageData = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
      }).then(res => res.json());
    return await this.eventService.updateEvent({
      where: {
        id: id
      },
      data: {
        image: imageData.data.url
      }
    });
  }
}
