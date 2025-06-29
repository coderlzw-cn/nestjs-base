import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfiguration } from '../../config/jwt.config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { TcpModule } from '../../shared/tcp/tcp.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      inject: [jwtConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof jwtConfiguration>) => configuration,
    }),
    TcpModule.register({
      defaultClient: {
        host: '127.0.0.1',
        port: 4000,
      },
      autoConnectClient: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
