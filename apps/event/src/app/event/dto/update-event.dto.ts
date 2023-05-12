import { EnumEventType, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto implements Prisma.EventUpdateInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  place?: Prisma.PlaceCreateNestedOneWithoutEventsInput;

  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type?: EnumEventType;
}
