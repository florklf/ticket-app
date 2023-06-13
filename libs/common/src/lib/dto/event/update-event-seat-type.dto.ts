import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';

export class UpdateEventSeatTypeDto implements Prisma.EventSeatTypeUpdateInput {

  @ApiProperty({default: 'price'})
  @IsInt()
  price: number;
}
