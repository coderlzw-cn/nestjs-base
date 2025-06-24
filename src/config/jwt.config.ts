import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import Joi from 'joi';

export const jwtConfigurationValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
};

export const jwtRefreshConfigurationValidationSchema = {
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
};

export const jwtConfiguration = registerAs<JwtModuleOptions>('jwt', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
}));

export const jwtRefreshConfiguration = registerAs<JwtModuleOptions>('jwtRefresh', () => ({
  secret: process.env.JWT_REFRESH_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
}));
