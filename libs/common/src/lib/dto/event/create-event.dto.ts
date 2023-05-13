import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnumEventType } from '@ticket-app/database';

export class CreateEventDto implements Prisma.EventCreateInput {
  @ApiProperty({default: 'name'})
  @IsString()
  name: string;

  @ApiProperty({default: 'description'})
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({default: 'prisma'})
  @IsNotEmpty()
  place: Prisma.PlaceCreateNestedOneWithoutEventsInput;

  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type: EnumEventType;
}
