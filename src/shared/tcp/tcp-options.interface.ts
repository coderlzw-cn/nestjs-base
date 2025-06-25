export interface TcpServerConfig {
  port: number;
  host?: string;
  backlog?: number;
  autoStart?: boolean;
}

export interface TcpClientConfig {
  host: string;
  port: number;
  timeout?: number;
  keepAlive?: boolean;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface TcpModuleOptions {
  /**
   * 默认服务器配置
   */
  defaultServer?: TcpServerConfig;

  /**
   * 默认客户端配置
   */
  defaultClient?: TcpClientConfig;

  /**
   * 多个服务器配置
   */
  servers?: Record<string, TcpServerConfig>;

  /**
   * 多个客户端配置
   */
  clients?: Record<string, TcpClientConfig>;

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
   * 是否自动启动所有配置的服务器
   * @default false
   */
  autoStartAllServers?: boolean;

  /**
   * 是否自动连接所有配置的客户端
   * @default false
   */
  autoConnectAllClients?: boolean;

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

  /**
   * 心跳间隔（毫秒）
   * @default 30000
   */
  heartbeatInterval?: number;

  /**
   * 是否启用心跳
   * @default false
   */
  enableHeartbeat?: boolean;
}
