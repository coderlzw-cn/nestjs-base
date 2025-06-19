import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = `${request.method}-${request.url}`;

    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return next.handle().pipe(tap((data) => this.cache.set(key, data)));
  }
}
