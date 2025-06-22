import { SetMetadata } from '@nestjs/common';

export interface CacheOptions {
  ttl?: number; // 缓存时间（秒）
  key?: string; // 自定义缓存键
}

export const CACHE_KEY = 'cache';
export const Cache = (options: CacheOptions = {}) => SetMetadata(CACHE_KEY, options);
