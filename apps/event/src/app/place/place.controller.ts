import { BadRequestException, Controller, ValidationPipe } from '@nestjs/common';
import { Prisma, Place } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PlaceService } from './place.service';
import { CreatePlaceDto, UpdatePlaceDto } from '@ticket-app/common';

@ApiTags('places')
@Controller()
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @MessagePattern({ cmd: 'findPlace' })
  async getPlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.placeService.place({
      where: data,
      include: {
        seatTypes: true,
      }
    });
  }

  @MessagePattern({ cmd: 'findPlaces' })
  async findAll(): Promise<Place[]> {
    return await this.placeService.places({
      include: {
        seatTypes: true,
      }
    });
  }

  @MessagePattern({ cmd: 'createPlace' })
  async createPlace(@Payload(new ValidationPipe()) data: CreatePlaceDto): Promise<Place> {
    return await this.placeService.createPlace(data);
  }

  @MessagePattern({ cmd: 'updatePlace' })
  async updatePlace(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data', new ValidationPipe()) data: UpdatePlaceDto): Promise<Place> {
    return this.placeService.updatePlace({where, data});
  }

  @MessagePattern({ cmd: 'removePlace' })
  async removePlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    // check that there are no events in this place
    const placesWithEvents = Prisma.validator<Prisma.PlaceArgs>()({
      include: { events: true },
    })
    type PlacesWithEvents = Prisma.PlaceGetPayload<typeof placesWithEvents>
    if (await this.placeService.place({where: data, include: {events: true}}).then((place: PlacesWithEvents) => place.events.length > 0)) {
      throw new RpcException(new BadRequestException('Cannot delete place with events'));
    }
    return await this.placeService.deletePlace(data);
  }
}
