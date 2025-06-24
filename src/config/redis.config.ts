import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const redisConfigurationValidationSchema = {
  REDIS_HOST: Joi.string().required(),
};

export const redisConfiguration = registerAs<RedisModuleOptions>('redis', () => ({
  type: 'single',
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
}));
