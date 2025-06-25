import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import { MailModuleOptions } from '../shared/mailer/mailer.options';

export const mailerConfigurationValidationSchema = {
  host: Joi.string().required(),
  port: Joi.number().required(),
  secure: Joi.boolean().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  templateDir: Joi.string().required(),
  retryAttempts: Joi.number().required(),
  retryDelay: Joi.number().required(),
};

export const mailerConfiguration = registerAs<MailModuleOptions>('mailer', () => ({
  credentials: {
    host: process.env.MAILER_HOST ?? '',
    port: Number(process.env.MAILER_PORT ?? 0),
    secure: process.env.MAILER_SECURE === 'true' ? true : false,
    password: process.env.MAILER_PASSWORD ?? '',
    username: process.env.MAILER_USERNAME ?? '',
  },
  templateDir: process.env.MAILER_TEMPLATE_DIR ?? '',
}));
