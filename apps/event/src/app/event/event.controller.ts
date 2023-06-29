import { ConflictException, Controller, ForbiddenException, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { Prisma, Event, EnumEventType, EventSeatType } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto } from '@ticket-app/common';
import { EventSeatTypeService } from './event-seat-type.service';
import { Express } from 'express'
import { Multer } from 'multer';
import { throwError } from 'rxjs';
import { type } from 'os';
@ApiTags('event')
@Controller()
export class EventController {
  constructor(private readonly eventService: EventService, private readonly eventSeatTypeService: EventSeatTypeService) {}

  @MessagePattern({ cmd: 'findEvent' })
  async findEvent(data: Prisma.EventWhereUniqueInput): Promise<Event> {
    return await this.eventService.event({
      where: data,
      include: {
        type: true,
        place: {
          include: {
            seatTypes: true
          }
        },
        EventSeatType: {
          include: {
            seatType: true
          }
        },
        eventGenres: {
          include: {
            genre: {
              include: {
                type: true
              },
            },
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
        type: true,
        place: {
          include: {
            seatTypes: true
          }
        },
        EventSeatType: {
          include: {
            seatType: true
          }
        },
        eventGenres: {
          include: {
            genre: {
              include: {
                type: true
              },
            },
          }
        },
        eventArtists: {
          include: {
            artist: true,
          }
        }
      },
      skip,
      where,
      take
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
        eventGenres: {
          some: {
            genre: {
              type: {
                name: EnumEventType.CONCERT,
              }
            }
          }
        }
      },
      include: {
        place: true,
        type: true,
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

  @MessagePattern({ cmd: 'createEventSeatType' })
  async createEventSeatType(data: Prisma.EventSeatTypeCreateInput): Promise<EventSeatType> {
    const event: any = await this.eventService.event({
      where: { id: data.event?.connect?.id },
      include: { EventSeatType: true, place: { include: { seatTypes: true } }}
    });
    if (event.date < new Date()) {
      throw new RpcException(new ConflictException('Event is done or has already started'))
    }
    if (!event.place.seatTypes.some(seatType => !(event.EventSeatType.map(eventSeatType => eventSeatType.seat_type_id)).includes(seatType.id))) {
      throw new RpcException(new ForbiddenException('Sell has already started'))
    }
    const seatType = await this.eventSeatTypeService.eventSeatType({
      where: {
        event_id: data.event.connect.id,
        seat_type_id: data.seatType.connect.id
      }
    });
    if (seatType) {
      throw new RpcException(new ConflictException('Seat type already exists'))
    }
    return await this.eventSeatTypeService.createEventSeatType(data);
  }

  @MessagePattern({ cmd: 'updateEventSeatType' })
  async updateEventSeatType(@Payload('where') where: Prisma.EventSeatTypeWhereUniqueInput, @Payload('data') data: Prisma.EventSeatTypeUpdateInput): Promise<EventSeatType> {
    return await this.eventSeatTypeService.updateEventSeatType({where, data});
  }

  @MessagePattern({ cmd: 'removeEventSeatType' })
  async removeEventSeatType(data: Prisma.EventSeatTypeWhereUniqueInput): Promise<EventSeatType> {
    const seatType: any = await this.eventSeatTypeService.eventSeatType({
      where: { id: data.id },
      include: { event: { include: { place: true, EventSeatType: true }} }
    });
    if (!seatType.event.place.seatTypes.some(seatType => !(seatType.event.EventSeatType.map(eventSeatType => eventSeatType.seat_type_id)).includes(seatType.id))) {
      throw new RpcException(new ForbiddenException('Sell has already started'))
    }
    return await this.eventSeatTypeService.deleteEventSeatType(data);
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
