import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe<Output> implements PipeTransform {
  constructor(private schema: ZodSchema<Output>) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch {
      throw new BadRequestException('Validation failed');
    }
  }
}
