import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { Prisma, Place } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlaceService } from './place.service';
import { CreatePlaceDto, UpdatePlaceDto } from '@ticket-app/common';

@ApiTags('places')
@Controller()
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @MessagePattern({ cmd: 'findPlace' })
  async getPlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.placeService.place(data);
  }

  @MessagePattern({ cmd: 'findPlaces' })
  async findAll(): Promise<Place[]> {
    return await this.placeService.places({});
  }

  @MessagePattern({ cmd: 'createPlace' })
  async createPlace(@Payload(new ValidationPipe()) data: CreatePlaceDto): Promise<Place> {
    return await this.placeService.createPlace(data);
  }

  @MessagePattern({ cmd: 'updatePlace' })
  async updatePlace(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data', new ValidationPipe()) data: UpdatePlaceDto): Promise<Place> {
    Logger.log(data, 'updatePlace');
    return this.placeService.updatePlace({where, data});
  }

  @MessagePattern({ cmd: 'removePlace' })
  async removePlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.placeService.deletePlace(data);
  }
}
