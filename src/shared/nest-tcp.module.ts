import { Module } from '@nestjs/common';
import { TcpModule } from './tcp/tcp.module';
import { TcpService } from './tcp/tcp.service';

@Module({
  imports: [
    TcpModule.register({
      // defaultClient: {
      //   host: '127.0.0.1',
      //   port: 4000,
      // },
      // clients: {
      //   'redis-client': {
      //     host: 'localhost',
      //     port: 4000,
      //     // autoConnect: true,
      //     reconnectInterval: 5000,
      //     maxReconnectAttempts: 10,
      //   },
      //   'database-client': {
      //     host: 'localhost',
      //     port: 4000,
      //     // autoConnect: true,
      //     timeout: 10000,
      //   },
      // },
      // autoConnectClient: true,
    }),
  ],
})
export class NestTcpModule {
  constructor(private readonly tcpService: TcpService) {
    // setInterval(() => {
    //   // 基于你的配置，这些名称会被自动推断
    //   this.tcpService.sendToClient('default', 'hello world');
    //   this.tcpService.sendToClient('redis-client', 'hello redis');
    //   this.tcpService.sendToClient('database-client', 'hello db');
    // }, 3000);
    // this.tcpService.on('clientData', (message: ClientMessage) => {
    //   console.log(JSON.stringify({ ...message, data: message.data.toString() }));
    // });
  }
}
