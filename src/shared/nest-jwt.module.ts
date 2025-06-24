import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfiguration } from '../config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      inject: [jwtConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof jwtConfiguration>) => configuration,
      global: true,
    }),
  ],
})
export class NestJwtModule {}
