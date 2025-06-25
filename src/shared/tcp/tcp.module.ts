import { Module } from '@nestjs/common';
import { TcpService } from './tcp.service';
import { ConfigurableModuleClass } from './tcp.module-definition';

@Module({
  providers: [TcpService],
  exports: [TcpService],
})
export class TcpModule extends ConfigurableModuleClass {}
