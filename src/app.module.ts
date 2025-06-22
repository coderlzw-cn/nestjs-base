import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { NestConfigModule } from './shared/nest-config.module';
import { NestDatabaseModule } from './shared/nest-database.module';
import { NestJwtModule } from './shared/nest-jwt.module';

@Module({
  imports: [
    NestConfigModule,
    NestDatabaseModule,
    NestJwtModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    // CleanCacheJob,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
