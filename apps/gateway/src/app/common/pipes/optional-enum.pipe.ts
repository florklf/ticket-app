import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ParseEnumPipe } from '@nestjs/common/pipes/parse-enum.pipe';

@Injectable()
export class OptionalParseEnumPipe implements PipeTransform {
  constructor(private readonly enumType: any, private readonly options?: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) return value; // Return as it is if the value is not provided
    const pipe = new ParseEnumPipe(this.enumType, this.options);
    return pipe.transform(value, metadata);
  }
}
