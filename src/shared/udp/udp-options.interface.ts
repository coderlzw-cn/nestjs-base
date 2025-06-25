export interface UdpModuleOptions {
  /**
   * 是否启用 UDP 功能
   * @default true
   */
  enabled?: boolean;

  /**
   * 默认服务器配置
   */
  defaultServer?: {
    port: number;
    host?: string;
    reuseAddr?: boolean;
  };

  /**
   * 默认客户端配置
   */
  defaultClient?: {
    host: string;
    port: number;
    timeout?: number;
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
}
