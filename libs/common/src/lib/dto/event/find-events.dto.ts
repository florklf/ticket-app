import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { EnumEventType } from '@ticket-app/database';
import { Type } from 'class-transformer';

export class FindEventsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([4, 12, 24, 48, 96])
  limit: number;

  @IsOptional()
  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type: EnumEventType;

  @IsOptional()
  @ApiProperty()
  genre: string;

  @IsOptional()
  orderBy: Prisma.EventOrderByWithRelationInput;
}
