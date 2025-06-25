import { createKeyv } from '@keyv/redis';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Global, Inject, Injectable, Module } from '@nestjs/common';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
}

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      // imports: [ConfigModule],
      // inject: [ConfigService],
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
  ],
  exports: [CacheModule, CacheService],
  providers: [CacheService],
})
export class NestCacheModule {}
