import { Module } from '@nestjs/common';
import { UdpController } from '../controllers/udp.controller';
import { UdpService } from './udp.service';
import { ConfigurableModuleClass } from './upd.module-definition';

@Module({
  providers: [UdpService],
  controllers: [UdpController],
  exports: [UdpService],
})
export class NestUdpModule extends ConfigurableModuleClass {}
