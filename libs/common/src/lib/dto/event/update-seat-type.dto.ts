import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';

export class UpdateSeatTypeDto implements Prisma.SeatTypeUpdateInput {
  @ApiProperty({default: 'name'})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({default: 100})
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({default: 'place'})
  @IsOptional()
  @IsNotEmptyObject()
  place?: Prisma.PlaceCreateNestedOneWithoutSeatTypesInput;
}
