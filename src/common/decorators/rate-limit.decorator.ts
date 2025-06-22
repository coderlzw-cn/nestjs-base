import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  ttl: number; // 时间窗口（秒）
  limit: number; // 最大请求次数
}

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);
