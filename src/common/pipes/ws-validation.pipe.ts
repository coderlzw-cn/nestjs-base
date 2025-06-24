import type { ValidationError } from '@nestjs/common';
import { BadRequestException, Injectable, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      exceptionFactory: (errors: ValidationError[]): BadRequestException => new BadRequestException(errors),
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      ...options,
    });
  }
}
