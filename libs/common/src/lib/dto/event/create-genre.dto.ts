import { EnumEventType, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGenreDto implements Prisma.GenreCreateInput {
  @ApiProperty({default: 'name'})
  @IsNotEmpty()
  name: string;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmpty()
  type: Prisma.TypeCreateNestedOneWithoutGenresInput;
}
