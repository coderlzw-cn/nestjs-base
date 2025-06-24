import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfiguration } from '../config/mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongoConfiguration)],
      inject: [mongoConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof mongoConfiguration>) => configuration,
    }),
  ],
})
export class NestDatabaseModule {}
