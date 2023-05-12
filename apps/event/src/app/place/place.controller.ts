import { Controller, UseFilters } from '@nestjs/common';
import { Prisma, Place } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaClientExceptionFilter } from '@ticket-app/database';

import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@ApiTags('places')
@UseFilters(new PrismaClientExceptionFilter())
@Controller({ path: 'places' })
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @MessagePattern({ cmd: 'getPlace' })
  async getPlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.placeService.place(data);
  }

  @MessagePattern({ cmd: 'getPlaces' })
  async findAll(): Promise<Place[]> {
    return await this.placeService.places({});
  }

  @MessagePattern({ cmd: 'createPlace' })
  async createPlace(data: CreatePlaceDto): Promise<Place> {
    return await this.placeService.createPlace(data);
  }

  @MessagePattern({ cmd: 'updatePlace' })
  async updatePlace(data: { where: Prisma.UserWhereUniqueInput; data: UpdatePlaceDto }): Promise<Place> {
    return this.placeService.updatePlace(data);
  }

  @MessagePattern({ cmd: 'removePlace' })
  async removePlace(data: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.placeService.deletePlace(data);
  }
}
