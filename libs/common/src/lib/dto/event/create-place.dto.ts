import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsPostalCode, IsString } from 'class-validator';

export class CreatePlaceDto implements Prisma.PlaceCreateInput {
  @ApiProperty({default: 'name'})
  @IsString()
  name: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({default: '30 rue test'})
  @IsString()
  address: string;

  @ApiProperty({default: 'Paris'})
  @IsString()
  city: string;

  @ApiProperty({default: '75000'})
  @IsPostalCode('FR')
  zip: string;

  @ApiProperty({default: 48.8566})
  @IsNumber()
  lat: number;

  @ApiProperty({default: 2.3522})
  @IsNumber()
  lng: number;
}
