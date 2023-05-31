import { EnumGenre, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateGenreDto implements Prisma.GenreUpdateInput {
  @ApiProperty({ enum: EnumGenre })
  @IsEnum(EnumGenre)
  name: EnumGenre;
}
