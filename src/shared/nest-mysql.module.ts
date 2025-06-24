import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfiguration } from '../config/mysql.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(mysqlConfiguration)],
      inject: [mysqlConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof mysqlConfiguration>) => configuration,
    }),
  ],
})
export class NestDatabaseModule {}
