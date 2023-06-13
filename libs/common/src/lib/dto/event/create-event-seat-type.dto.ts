import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';

export class CreateEventSeatTypeDto implements Prisma.EventSeatTypeCreateInput {

  @ApiProperty({default: 'price'})
  @IsInt()
  price: number;

  @IsInt()
  available_seats: number;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmptyObject()
  seatType: Prisma.SeatTypeCreateNestedOneWithoutEventSeatTypeInput;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmptyObject()
  event: Prisma.EventCreateNestedOneWithoutEventSeatTypeInput;
}
