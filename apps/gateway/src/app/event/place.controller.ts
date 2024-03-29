import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe } from '@nestjs/common';
import { Place } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto, UpdatePlaceDto } from '@ticket-app/common';

@Controller('places')
@ApiTags('places')
export class PlaceController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Place> {
    return await lastValueFrom(await this.client.send({ cmd: 'findPlace' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  async findAll(): Promise<Place[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findPlaces' }, {})
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post()
  @ApiBody({ type: CreatePlaceDto })
  async create(@Body(new ValidationPipe) createPlaceDto: CreatePlaceDto): Promise<Place> {
    return await lastValueFrom(await this.client.send({ cmd: 'createPlace' }, createPlaceDto)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePlaceDto })
  async update(@Param('id') id: string, @Body(new ValidationPipe) updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updatePlace' },
        {
          where: { id: +id },
          data: updatePlaceDto,
        }
      )
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Place> {
    return await lastValueFrom(await this.client.send({ cmd: 'removePlace' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
