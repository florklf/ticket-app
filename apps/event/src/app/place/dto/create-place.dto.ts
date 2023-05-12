import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsPostalCode, IsString } from 'class-validator';

export class CreatePlaceDto implements Prisma.PlaceCreateInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsPostalCode('FR')
  zip: string;
}
