import { IsString } from 'class-validator';

export class VerifyOrderDto {
  @IsString()
  qr_code_decoded: string;
}
