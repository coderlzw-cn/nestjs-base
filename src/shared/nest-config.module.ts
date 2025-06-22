import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { mysqlConfiguration, mysqlConfigurationValidationSchema } from 'src/config/mysql.config';

const envFilePath = process.env.NODE_ENV === 'dev' ? ['.env.local', '.env.dev'] : ['.env.local', '.env.prod'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'].concat(envFilePath),
      load: [mysqlConfiguration],
      validationSchema: Joi.object({
        ...mysqlConfigurationValidationSchema,
      }),
    }),
  ],
})
export class NestConfigModule {}
