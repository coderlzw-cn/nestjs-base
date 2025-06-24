import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { TcpController } from './controllers/tcp.controller';
import { TcpService } from './services/tcp.service';

export interface TcpModuleOptions {
  /**
   * 是否启用 TCP 功能
   * @default true
   */
  enabled?: boolean;

  /**
   * 默认服务器配置
   */
  defaultServer?: {
    port: number;
    host?: string;
    backlog?: number;
  };

  /**
   * 默认客户端配置
   */
  defaultClient?: {
    host: string;
    port: number;
    timeout?: number;
    keepAlive?: boolean;
  };

  /**
   * 是否自动启动默认服务器
   * @default false
   */
  autoStartServer?: boolean;

  /**
   * 是否自动连接默认客户端
   * @default false
   */
  autoConnectClient?: boolean;

  /**
   * 日志级别
   * @default 'info'
   */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';

  /**
   * 连接超时时间（毫秒）
   * @default 30000
   */
  connectionTimeout?: number;

  /**
   * 最大连接数
   * @default 1000
   */
  maxConnections?: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<TcpModuleOptions>()
  .setExtras(
    {
      isGlobal: false,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();

@Module({
  providers: [TcpService],
  controllers: [TcpController],
  exports: [TcpService],
})
export class NestTcpModule extends ConfigurableModuleClass {}
