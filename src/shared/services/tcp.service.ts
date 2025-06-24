import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as net from 'net';
import { MODULE_OPTIONS_TOKEN, TcpModuleOptions } from '../nest-tcp.module';

export interface TcpServerConfig {
  port: number;
  host?: string;
  backlog?: number;
}

export interface TcpClientConfig {
  host: string;
  port: number;
  timeout?: number;
  keepAlive?: boolean;
}

export interface TcpConnection {
  id: string;
  socket: net.Socket;
  remoteAddress: string;
  remotePort: number;
  localAddress: string;
  localPort: number;
}

export interface TcpMessage {
  data: Buffer;
  connectionId: string;
}

@Injectable()
export class TcpService extends EventEmitter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TcpService.name);
  private servers: Map<string, net.Server> = new Map();
  private clients: Map<string, net.Socket> = new Map();
  private connections: Map<string, TcpConnection> = new Map();
  private connectionCounter = 0;
  private options: TcpModuleOptions;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: TcpModuleOptions) {
    super();
    this.options = options;
  }

  onModuleInit() {
    this.logger.log('TCP Service initializing...');

    if (!this.options.enabled) {
      this.logger.log('TCP Service is disabled');
      return;
    }

    // 自动启动默认服务器
    if (this.options.autoStartServer && this.options.defaultServer) {
      this.createServer('default', this.options.defaultServer)
        .then(() => {
          this.logger.log('Default TCP server started automatically');
        })
        .catch((error) => {
          this.logger.error('Failed to start default TCP server:', error);
        });
    }

    // 自动连接默认客户端
    if (this.options.autoConnectClient && this.options.defaultClient) {
      this.createClient('default', this.options.defaultClient)
        .then(() => {
          this.logger.log('Default TCP client created automatically');
        })
        .catch((error) => {
          this.logger.error('Failed to create default TCP client:', error);
        });
    }

    this.logger.log('TCP Service initialized');
  }

  async onModuleDestroy() {
    this.logger.log('TCP Service destroying...');
    await this.closeAllServers();
    await this.closeAllClients();
  }

  /**
   * 创建 TCP 服务器
   * @param name 服务器名称
   * @param config 服务器配置
   * @returns Promise<void>
   */
  async createServer(name: string, config: TcpServerConfig): Promise<void> {
    if (this.servers.has(name)) {
      throw new Error(`TCP server '${name}' already exists`);
    }

    const server = net.createServer((socket) => {
      const connectionId = this.generateConnectionId();
      const connection: TcpConnection = {
        id: connectionId,
        socket,
        remoteAddress: socket.remoteAddress || 'unknown',
        remotePort: socket.remotePort || 0,
        localAddress: socket.localAddress || 'unknown',
        localPort: socket.localPort || 0,
      };

      this.connections.set(connectionId, connection);

      this.logger.log(`TCP server '${name}' new connection: ${connectionId} from ${connection.remoteAddress}:${connection.remotePort}`);

      socket.on('data', (data) => {
        const message: TcpMessage = {
          data,
          connectionId,
        };

        this.logger.debug(`TCP server '${name}' received data from ${connectionId}: ${data.length} bytes`);
        this.emit('data', { name, message });
      });

      socket.on('end', () => {
        this.logger.log(`TCP server '${name}' connection ended: ${connectionId}`);
        this.connections.delete(connectionId);
        this.emit('connectionEnd', { name, connectionId });
      });

      socket.on('error', (err) => {
        this.logger.error(`TCP server '${name}' connection error: ${connectionId}`, err);
        this.connections.delete(connectionId);
        this.emit('connectionError', { name, connectionId, error: err });
      });

      this.emit('connection', { name, connection });
    });

    server.on('error', (err) => {
      this.logger.error(`TCP server '${name}' error:`, err);
      this.emit('serverError', { name, error: err });
    });

    server.on('listening', () => {
      const address = server.address() as net.AddressInfo;
      this.logger.log(`TCP server '${name}' listening on ${address.address}:${address.port}`);
      this.emit('listening', { name, address });
    });

    return new Promise((resolve, reject) => {
      server.listen(config.port, config.host || '0.0.0.0', config.backlog || 511, () => {
        this.servers.set(name, server);
        resolve();
      });

      server.on('error', reject);
    });
  }

  /**
   * 关闭 TCP 服务器
   * @param name 服务器名称
   */
  async closeServer(name: string): Promise<void> {
    const server = this.servers.get(name);
    if (!server) {
      throw new Error(`TCP server '${name}' not found`);
    }

    return new Promise((resolve) => {
      server.close(() => {
        this.servers.delete(name);
        this.logger.log(`TCP server '${name}' closed`);
        resolve();
      });
    });
  }

  /**
   * 关闭所有 TCP 服务器
   */
  async closeAllServers(): Promise<void> {
    const promises = Array.from(this.servers.keys()).map((name) => this.closeServer(name));
    await Promise.all(promises);
  }

  /**
   * 创建 TCP 客户端
   * @param name 客户端名称
   * @param config 客户端配置
   * @returns Promise<void>
   */
  async createClient(name: string, config: TcpClientConfig): Promise<void> {
    if (this.clients.has(name)) {
      throw new Error(`TCP client '${name}' already exists`);
    }

    const client = new net.Socket();

    client.on('connect', () => {
      this.logger.log(`TCP client '${name}' connected to ${config.host}:${config.port}`);
      this.emit('clientConnect', { name });
    });

    client.on('data', (data) => {
      this.logger.debug(`TCP client '${name}' received data: ${data.length} bytes`);
      this.emit('clientData', { name, data });
    });

    client.on('end', () => {
      this.logger.log(`TCP client '${name}' connection ended`);
      this.emit('clientEnd', { name });
    });

    client.on('error', (err) => {
      this.logger.error(`TCP client '${name}' error:`, err);
      this.emit('clientError', { name, error: err });
    });

    client.on('close', () => {
      this.logger.log(`TCP client '${name}' connection closed`);
      this.emit('clientClose', { name });
    });

    if (config.timeout) {
      client.setTimeout(config.timeout);
    }

    if (config.keepAlive) {
      client.setKeepAlive(true);
    }

    this.clients.set(name, client);
    this.logger.log(`TCP client '${name}' created for ${config.host}:${config.port}`);
  }

  /**
   * 连接 TCP 客户端
   * @param name 客户端名称
   * @param config 连接配置
   * @returns Promise<void>
   */
  async connectClient(name: string, config: TcpClientConfig): Promise<void> {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`TCP client '${name}' not found`);
    }

    return new Promise((resolve, reject) => {
      client.connect(config.port, config.host, () => {
        resolve();
      });

      client.on('error', reject);
    });
  }

  /**
   * 发送 TCP 消息
   * @param name 客户端名称
   * @param data 要发送的数据
   * @returns Promise<void>
   */
  async sendMessage(name: string, data: Buffer | string): Promise<void> {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`TCP client '${name}' not found`);
    }

    const message = typeof data === 'string' ? Buffer.from(data) : data;
    client.write(message);
    this.logger.debug(`TCP client '${name}' sent message: ${message.length} bytes`);
  }

  /**
   * 向特定连接发送消息
   * @param connectionId 连接ID
   * @param data 要发送的数据
   * @returns Promise<void>
   */
  async sendToConnection(connectionId: string, data: Buffer | string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`TCP connection '${connectionId}' not found`);
    }

    const message = typeof data === 'string' ? Buffer.from(data) : data;
    connection.socket.write(message);
    this.logger.debug(`TCP connection '${connectionId}' sent message: ${message.length} bytes`);
  }

  /**
   * 关闭 TCP 客户端
   * @param name 客户端名称
   */
  async closeClient(name: string): Promise<void> {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`TCP client '${name}' not found`);
    }

    return new Promise((resolve) => {
      client.end(() => {
        this.clients.delete(name);
        this.logger.log(`TCP client '${name}' closed`);
        resolve();
      });
    });
  }

  /**
   * 关闭所有 TCP 客户端
   */
  async closeAllClients(): Promise<void> {
    const promises = Array.from(this.clients.keys()).map((name) => this.closeClient(name));
    await Promise.all(promises);
  }

  /**
   * 关闭特定连接
   * @param connectionId 连接ID
   */
  async closeConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`TCP connection '${connectionId}' not found`);
    }

    return new Promise((resolve) => {
      connection.socket.end(() => {
        this.connections.delete(connectionId);
        this.logger.log(`TCP connection '${connectionId}' closed`);
        resolve();
      });
    });
  }

  /**
   * 生成连接ID
   */
  private generateConnectionId(): string {
    return `conn_${++this.connectionCounter}_${Date.now()}`;
  }

  /**
   * 获取服务器列表
   */
  getServerNames(): string[] {
    return Array.from(this.servers.keys());
  }

  /**
   * 获取客户端列表
   */
  getClientNames(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * 获取连接列表
   */
  getConnectionIds(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * 检查服务器是否存在
   */
  hasServer(name: string): boolean {
    return this.servers.has(name);
  }

  /**
   * 检查客户端是否存在
   */
  hasClient(name: string): boolean {
    return this.clients.has(name);
  }

  /**
   * 检查连接是否存在
   */
  hasConnection(connectionId: string): boolean {
    return this.connections.has(connectionId);
  }

  /**
   * 获取模块配置
   */
  getOptions(): TcpModuleOptions {
    return this.options;
  }
}
