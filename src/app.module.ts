import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { GatewaysModule } from './gateways/gateways.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { NestConfigModule } from './shared/nest-config.module';
import { NestJwtModule } from './shared/nest-jwt.module';
import { NestMailerModule } from './shared/nest-mailer.module';
import { NestDatabaseModule } from './shared/nest-mysql.module';
import { NestTcpModule } from './shared/nest-tcp.module';

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
    RoleModule,
    PermissionModule,
    GatewaysModule,
    HealthModule,
    NestTcpModule,
    NestMailerModule,
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
