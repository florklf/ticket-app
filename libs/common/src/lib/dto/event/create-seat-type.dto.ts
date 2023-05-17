import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';

export class CreateSeatTypeDto implements Prisma.SeatTypeCreateInput {
  @ApiProperty({default: 'name'})
  @IsString()
  name: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({default: 100})
  @IsInt()
  capacity: number;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmptyObject()
  place: Prisma.PlaceCreateNestedOneWithoutSeatTypesInput;
}
