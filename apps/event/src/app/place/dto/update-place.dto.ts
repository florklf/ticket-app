import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsPostalCode, IsString } from 'class-validator';

export class UpdatePlaceDto implements Prisma.PlaceUpdateInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsPostalCode('FR')
  zip?: string;
}
