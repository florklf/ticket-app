import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe } from '@nestjs/common';
import { SeatType } from '@ticket-app/database';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSeatTypeDto, UpdateSeatTypeDto } from '@ticket-app/common';

@Controller('seat-types')
@ApiTags('seatTypes')
export class SeatTypeController {
  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'findSeatType' }, { id: +id }));
  }

  @Get()
  async findAll(): Promise<SeatType[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findSeatTypes' }, {}));
  }

  @Post()
  @ApiBody({ type: CreateSeatTypeDto })
  async create(@Body(new ValidationPipe) createSeatTypeDto: CreateSeatTypeDto): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'createSeatType' }, createSeatTypeDto));
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
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SeatType> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeSeatType' }, { id: +id }));
  }
}
