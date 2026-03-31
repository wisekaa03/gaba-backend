import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z, type ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      // Возвращаем структуру ошибок, чтобы клиенту было проще понять что не так.
      const formatted = z.treeifyError(parsed.error);
      throw new BadRequestException(formatted);
    }
    return parsed.data;
  }
}
