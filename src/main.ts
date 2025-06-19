import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { ErrorsInterceptor } from './interceptor/errors.interceptor';
import { RetryInterceptor } from './interceptor/retry.interceptor';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.HOST ?? '0.0.0.0';
  const port = process.env.PORT ?? 3000;

  app.setGlobalPrefix('api');
  app.use(RequestLoggerMiddleware);
  app.useGlobalInterceptors(new RetryInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalInterceptors(new CacheInterceptor());
  await app.listen(port, host);
  Logger.log(`Server is running on http://${host}:${port}`, 'Bootstrap');
}
void bootstrap();
