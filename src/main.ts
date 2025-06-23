import { ConsoleLogger, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

declare const module: {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
};

const swaggerBootstrap = (app: INestApplication, env: string) => {
  const configService = app.get<ConfigService>(ConfigService);
  const host = configService.get<string>('HOST') ?? '0.0.0.0';
  const port = configService.get<number>('PORT') ?? 3000;

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the project')
    .setVersion('1.0')
    .addServer(`http://${host}:${port}`, 'Dev')
    .addServer(`http://${host}:${port}`, 'Prod')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('John Doe', 'https://github.com/johndoe', 'john.doe@example.com')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    // extraModels: [User, AuthProviders, Role, Permission, UserRole, RolePermission], // 明确包含所有实体
  });
  SwaggerModule.setup('swagger', app, document, {
    raw: env === 'dev',
    ui: env === 'dev',
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true, // 持久化授权
      displayRequestDuration: true, // 显示请求耗时
      displayOperationId: true, // 显示操作ID
      displayResponseHeaders: true, // 显示响应头
      tryItOutEnabled: true, // 启用Try It Out
      requestSnippetsEnabled: true, // 启用请求片段
    },
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    bufferLogs: true,
    logger: new ConsoleLogger({
      json: false,
      timestamp: true,
      context: 'NestApplication',
    }),
  });
  const configService = app.get<ConfigService>(ConfigService);
  const httpAdapter = app.get<HttpAdapterHost>(HttpAdapterHost);

  const host = configService.get<string>('HOST') ?? '0.0.0.0';
  const port = configService.get<number>('PORT') ?? 3000;
  const prefix = configService.get<string>('API_PREFIX') ?? 'api';
  const env = configService.get<string>('NODE_ENV') ?? 'dev';

  app.enableShutdownHooks(); // 启用生命周期钩子
  app.enableCors({
    origin: true, // 或指定 ['http://localhost:3000']
    credentials: true,
  });
  // 全局前缀
  app.setGlobalPrefix(prefix);

  //  全局中间件
  app.use(RequestLoggerMiddleware);

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 去除 DTO 中未声明的字段
      // forbidNonWhitelisted: true, // 禁止 DTO 中未声明字段直接抛异常
      transform: true, // 自动转换 payload 为 DTO 类型
    }),
  );

  // 全局拦截器
  // app.useGlobalInterceptors(new RetryInterceptor()); // 重试拦截器
  app.useGlobalInterceptors(new TransformInterceptor()); // 转换拦截器
  app.useGlobalInterceptors(new TimeoutInterceptor()); // 超时拦截器
  // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter)); // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局异常过滤器

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close()); // 热更新时关闭应用
  }

  // Swagger
  swaggerBootstrap(app, env);

  await app.listen(port, host);
  Logger.log(`🚀 NODE_ENV: ${env}`);
  Logger.log(`🚀 Server is running on http://${host}:${port}`);
  Logger.log(`🚀 Swagger is running on http://${host}:${port}/swagger`);
}
void bootstrap();
