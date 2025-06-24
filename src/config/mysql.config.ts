import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import path from 'node:path';

export const mysqlConfigurationValidationSchema = {
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().default('root'),
  DB_PASSWORD: Joi.string().default('password'),
  DB_DATABASE: Joi.string().default('nestjs_base'),
};

export const mysqlConfiguration = registerAs<TypeOrmModuleOptions>('mysql', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '..', '**/*.entity{.ts,.js}')],
  synchronize: process.env.NODE_ENV === 'dev',
  logging: process.env.NODE_ENV !== 'dev',
}));
