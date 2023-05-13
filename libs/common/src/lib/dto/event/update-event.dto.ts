import { EnumEventType, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto implements Prisma.EventUpdateInput {
  @ApiProperty({default: 'name'})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({default: 'place'})
  @IsOptional()
  place?: Prisma.PlaceCreateNestedOneWithoutEventsInput;

  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type?: EnumEventType;
}
