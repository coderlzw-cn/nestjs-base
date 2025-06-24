import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import Joi from 'joi';

export const mongoConfigurationValidationSchema = Joi.object({
  uri: Joi.string().required(),
  dbName: Joi.string().required(),
  options: Joi.object({
    useNewUrlParser: Joi.boolean().required(),
    useUnifiedTopology: Joi.boolean().required(),
  }),
});
export const mongoConfiguration = registerAs<MongooseModuleOptions>('mongo', () => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}));
