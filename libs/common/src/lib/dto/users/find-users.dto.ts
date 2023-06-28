import { EnumRole, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number;

  @IsOptional()
  @ApiProperty({ enum: EnumRole })
  @IsEnum(EnumRole)
  role: EnumRole;

  @IsOptional()
  orderBy: Prisma.EventOrderByWithRelationInput;
}
