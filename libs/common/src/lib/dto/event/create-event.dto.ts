import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnumEventType } from '@ticket-app/database';
import { Transform, Type } from 'class-transformer';

export class CreateEventDto implements Prisma.EventCreateInput {
  @ApiProperty({default: 'name'})
  @IsString()
  name: string;

  @ApiProperty({default: 'description'})
  @IsString()
  description: string;

  @ApiProperty({ enum: EnumEventType })
  @IsEnum(EnumEventType)
  type: EnumEventType;

  @Transform( ({ value }) => value && new Date(value))
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  @IsNotEmpty()
  place: Prisma.PlaceCreateNestedOneWithoutEventsInput;

  @ApiProperty({default: 'image'})
  @IsString()
  image: string;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  eventGenres?: Prisma.EventGenreCreateNestedManyWithoutEventInput;

  @ApiProperty({default: {
    connect: {
      id: 1
    }
  }})
  eventArtists?: Prisma.EventArtistCreateNestedManyWithoutEventInput;
}
