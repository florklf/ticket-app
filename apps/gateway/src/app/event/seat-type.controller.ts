import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe } from '@nestjs/common';
import { SeatType } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSeatTypeDto, UpdateSeatTypeDto } from '@ticket-app/common';

@Controller('seat-types')
@ApiTags('seatTypes')
export class SeatTypeController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'findSeatType' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  async findAll(): Promise<SeatType[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findSeatTypes' }, {})
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post()
  @ApiBody({ type: CreateSeatTypeDto })
  async create(@Body(new ValidationPipe) createSeatTypeDto: CreateSeatTypeDto): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'createSeatType' }, createSeatTypeDto)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch(':id')
  @ApiBody({ type: UpdateSeatTypeDto })
  async update(@Param('id') id: string, @Body(new ValidationPipe) updateSeatTypeDto: UpdateSeatTypeDto): Promise<SeatType> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateSeatType' },
        {
          where: { id: +id },
          data: updateSeatTypeDto,
        }
      )
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeSeatType' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
