import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MailModule } from './mailer/mailer.module';
import { mailerConfiguration } from '../config/mailer.config';

@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailerConfiguration)],
      inject: [mailerConfiguration.KEY],
      useFactory: (configuration: ConfigType<typeof mailerConfiguration>) => configuration,
    }),
  ],
})
export class NestMailerModule {}
