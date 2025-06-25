import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { seconds, ThrottlerModule } from '@nestjs/throttler';

export const throttleConfiguration = registerAs('throttle', () => {
  return {
    redisHost: '192.168.200.2',
    redisPort: 6379,
    redisPass: 'root',
    // 1s 内允许两个请求通过
    seconds: 1,
    limit: 2,
  };
});

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, ConfigModule.forFeature(throttleConfiguration)],
      inject: [ConfigService, throttleConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof throttleConfiguration>) => ({
        ttl: seconds(configuration.seconds),
        limit: configuration.limit,
        ignoreUserAgents: [/nestify/i],
        // storage: new ThrottlerStorageRedisService(
        //   new Redis({
        //     host: configuration.redisHost,
        //     port: configuration.redisPort,
        //     password: configuration.redisPass,
        //     socketTimeout: 1000,
        //     db: 0,
        //     sentinelMaxConnections: 2
        //   }),
        // ),
        throttlers: [],
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class NestThrottlerModule {}
