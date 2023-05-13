import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptional, IsPostalCode, IsString } from 'class-validator';

export class UpdatePlaceDto implements Prisma.PlaceUpdateInput {
  @ApiProperty({default: 'name'})
  @IsOptional()
  name?: string;

  @ApiProperty({default: 'description'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({default: '30 rue test'})
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({default: 'Paris'})
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({default: '75000'})
  @IsOptional()
  @IsPostalCode('FR')
  zip?: string;
}
