import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { EnumTimeScope } from '../../interfaces/EnumTimeScope';
import { Type } from 'class-transformer';

export class FindOrdersDto {

  @IsOptional()
  @ApiProperty({ enum: EnumTimeScope })
  @IsEnum(EnumTimeScope)
  time: EnumTimeScope;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([5,10,20])
  limit: number;
}
