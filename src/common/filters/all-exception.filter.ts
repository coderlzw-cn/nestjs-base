import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const { httpAdapter } = this.httpAdapterHost;
    console.log('all-exception-filter', exception);

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 安全地获取错误消息
    const getErrorMessage = (error: unknown): string => {
      if (error instanceof Error) {
        return error.message;
      }
      if (typeof error === 'string') {
        return error;
      }
      return 'Internal server error';
    };

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: getErrorMessage(exception),
      path: httpAdapter.getRequestUrl(ctx.getRequest<Request>()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

    return throwError(() => exception);
  }
}
