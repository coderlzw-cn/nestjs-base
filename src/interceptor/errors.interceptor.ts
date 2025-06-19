import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: Error) => {
        if (err instanceof HttpException) {
          return throwError(() => {
            return {
              statusCode: err.getStatus(),
              message: err.message,
            };
          });
        }
        return throwError(() => {
          return {
            statusCode: 500,
            message: 'Internal server error',
          };
        });
      }),
    );
  }
}
