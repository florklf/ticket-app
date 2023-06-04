import { EnumGenre, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class CreateGenreDto implements Prisma.GenreCreateInput {
  @ApiProperty({ enum: EnumGenre })
  @IsEnum(EnumGenre)
  name: EnumGenre;
}
