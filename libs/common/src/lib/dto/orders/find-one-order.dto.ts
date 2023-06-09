import { IsNumberString } from 'class-validator';

export class FindOneOrderParams {
  @IsNumberString()
  id: number;
}
