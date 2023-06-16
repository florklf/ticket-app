import { EnumEventType, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateEventDto implements Prisma.EventUpdateInput {
  @ApiProperty({default: 'name'})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @Transform( ({ value }) => value && new Date(value))
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiProperty()
  @IsOptional()
  place?: Prisma.PlaceCreateNestedOneWithoutEventsInput;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmpty()
  type: Prisma.TypeCreateNestedOneWithoutGenresInput;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsOptional()
  eventGenres?: Prisma.EventGenreCreateNestedManyWithoutEventInput;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})

  @IsOptional()
  eventArtists?: Prisma.EventArtistCreateNestedManyWithoutEventInput;

  @ApiProperty({default: 'https://picsum.photos/seed/picsum/1000'})
  @IsOptional()
  @IsString()
  image?: string | Prisma.NullableStringFieldUpdateOperationsInput | null | undefined;
}
