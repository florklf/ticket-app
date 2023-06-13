import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { Prisma, SeatType } from '@ticket-app/database';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeatTypeService } from './seat-type.service';
import { CreateSeatTypeDto, UpdateSeatTypeDto } from '@ticket-app/common';

@ApiTags('seatTypes')
@Controller()
export class SeatTypeController {
  constructor(private readonly seatTypeService: SeatTypeService) {}

  @MessagePattern({ cmd: 'findSeatType' })
  async getSeatType(data: Prisma.SeatTypeWhereUniqueInput): Promise<SeatType> {
    return await this.seatTypeService.seatType({
      where: data
  });
  }

  @MessagePattern({ cmd: 'findSeatTypes' })
  async findAll(): Promise<SeatType[]> {
    return await this.seatTypeService.seatTypes({});
  }

  @MessagePattern({ cmd: 'createSeatType' })
  async createSeatType(@Payload(new ValidationPipe()) data: CreateSeatTypeDto): Promise<SeatType> {
    return await this.seatTypeService.createSeatType(data);
  }

  @MessagePattern({ cmd: 'updateSeatType' })
  async updateSeatType(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data', new ValidationPipe()) data: UpdateSeatTypeDto): Promise<SeatType> {
    return this.seatTypeService.updateSeatType({where, data});
  }

  @MessagePattern({ cmd: 'removeSeatType' })
  async removeSeatType(data: Prisma.SeatTypeWhereUniqueInput): Promise<SeatType> {
    return await this.seatTypeService.deleteSeatType(data);
  }
}
