import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { redisConfiguration } from '../config/redis.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule.forFeature(redisConfiguration)],
      inject: [redisConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof redisConfiguration>) => configuration,
    }),
  ],
})
export class NestDatabaseModule {}
