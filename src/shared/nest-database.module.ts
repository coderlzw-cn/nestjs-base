import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfiguration } from 'src/config/mysql.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(mysqlConfiguration)],
      useFactory: (configuration: ConfigType<typeof mysqlConfiguration>) => configuration,
      inject: [mysqlConfiguration.KEY],
    }),
  ],
})
export class NestDatabaseModule {}
