import { EnumEventType, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class FindGenresDto {
  @IsOptional()
  @ApiProperty({default: 'name'})
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type: EnumEventType;
}
