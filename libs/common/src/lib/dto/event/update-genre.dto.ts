import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateGenreDto implements Prisma.GenreUpdateInput {
  @ApiProperty()
  name: string;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmpty()
  type: Prisma.TypeCreateNestedOneWithoutGenresInput;
}
