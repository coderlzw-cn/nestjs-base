import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import net from 'net';
import { TcpClientConfig, TcpModuleOptions, TcpServerConfig } from './tcp-options.interface';
import { MODULE_OPTIONS_TOKEN } from './tcp.module-definition';

export interface TcpConnection {
  id: string;
  socket: net.Socket;
  remoteAddress: string;
  remotePort: number;
  localAddress: string;
  localPort: number;
  serverName?: string;
  clientName?: string;
}

export interface TcpMessage {
  data: Buffer;
  connectionId: string;
  serverName?: string;
  clientName?: string;
}

export interface TcpServerInfo {
  name: string;
  config: TcpServerConfig;
  server: net.Server;
  connections: TcpConnection[];
  isRunning: boolean;
}

export interface TcpClientInfo {
  name: string;
  config: TcpClientConfig;
  socket: net.Socket;
  isConnected: boolean;
  reconnectAttempts: number;
  reconnectTimer?: NodeJS.Timeout;
}

export interface ClientMessage {
  name: string;
  data: Buffer;
}

@Injectable()
export class TcpService extends EventEmitter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TcpService.name);
  private servers: Map<string, TcpServerInfo> = new Map();
  private clients: Map<string, TcpClientInfo> = new Map();
  private connections: Map<string, TcpConnection> = new Map();
  private connectionCounter = 0;
  private readonly options: TcpModuleOptions;
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: TcpModuleOptions) {
    super();
    this.options = options;
  }

  async onModuleInit() {
    this.logger.log('TCP Service initializing...');

    // 初始化所有配置的服务器
    // await this.initializeServers();

    // // 初始化所有配置的客户端
    // await this.initializeClients();

    // 启动心跳检测
    if (this.options.enableHeartbeat) {
      this.startHeartbeat();
    }

    this.logger.log('TCP Service initialized');
  }

  async onModuleDestroy() {
    this.logger.log('TCP Service destroying...');

    // 停止心跳检测
    this.stopHeartbeat();

    // 关闭所有服务器和客户端
    await this.closeAllServers();
    await this.closeAllClients();
  }

  /**
   * 初始化所有配置的服务器
   */
  private async initializeServers(): Promise<void> {
    // 初始化默认服务器
    if (this.options.defaultServer) {
      this.createServer('default', this.options.defaultServer);

      if (this.options.autoStartServer || this.options.defaultServer.autoStart) {
        await this.startServer('default');
      }
    }

    // 初始化多个服务器
    if (this.options.servers) {
      for (const [name, config] of Object.entries(this.options.servers)) {
        this.createServer(name, config);
        if (this.options.autoStartAllServers || config.autoStart) {
          await this.startServer(name);
        }
      }
    }
  }

  /**
   * 初始化所有配置的客户端
   */
  private async initializeClients(): Promise<void> {
    // 初始化默认客户端
    if (this.options.defaultClient) {
      this.createClient('default', this.options.defaultClient);

      if (this.options.autoConnectClient || this.options.defaultClient.autoConnect) {
        await this.connectClient('default');
      }
    }

    // 初始化多个客户端
    if (this.options.clients) {
      for (const [name, config] of Object.entries(this.options.clients)) {
        this.createClient(name, config);

        if (this.options.autoConnectAllClients || config.autoConnect) {
          await this.connectClient(name);
        }
      }
    }
  }

  /**
   * 创建 TCP 服务器
   */
  createServer(name: string, config: TcpServerConfig): void {
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
        serverName: name,
      };

      this.connections.set(connectionId, connection);

      // 添加到服务器的连接列表
      const serverInfo = this.servers.get(name);
      if (serverInfo) {
        serverInfo.connections.push(connection);
      }

      this.logger.log(`TCP server '${name}' new connection: ${connectionId} from ${connection.remoteAddress}:${connection.remotePort}`);

      socket.on('data', (data) => {
        const message: TcpMessage = {
          data,
          connectionId,
          serverName: name,
        };

        this.logger.debug(`TCP server '${name}' received data from ${connectionId}: ${data.length} bytes`);
        this.emit('data', { name, message });
      });

      socket.on('end', () => {
        this.logger.log(`TCP server '${name}' connection ended: ${connectionId}`);
        this.connections.delete(connectionId);

        // 从服务器的连接列表中移除
        const serverInfo = this.servers.get(name);
        if (serverInfo) {
          serverInfo.connections = serverInfo.connections.filter((conn) => conn.id !== connectionId);
        }

        this.emit('connectionEnd', { name, connectionId });
      });

      socket.on('error', (err) => {
        this.logger.error(`TCP server '${name}' connection error: ${connectionId}`, err);
        this.connections.delete(connectionId);

        // 从服务器的连接列表中移除
        const serverInfo = this.servers.get(name);
        if (serverInfo) {
          serverInfo.connections = serverInfo.connections.filter((conn) => conn.id !== connectionId);
        }

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

    const serverInfo: TcpServerInfo = {
      name,
      config,
      server,
      connections: [],
      isRunning: false,
    };

    this.servers.set(name, serverInfo);
    this.logger.log(`TCP server '${name}' created`);
  }

  /**
   * 启动 TCP 服务器
   */
  async startServer(name: string): Promise<void> {
    const serverInfo = this.servers.get(name);
    if (!serverInfo) {
      throw new Error(`TCP server '${name}' not found`);
    }

    if (serverInfo.isRunning) {
      this.logger.warn(`TCP server '${name}' is already running`);
      return;
    }

    return new Promise((resolve, reject) => {
      serverInfo.server.listen(serverInfo.config.port, serverInfo.config.host || '0.0.0.0', serverInfo.config.backlog || 511, () => {
        serverInfo.isRunning = true;
        this.logger.log(`TCP server '${name}' started on port ${serverInfo.config.port}`);
        resolve();
      });

      serverInfo.server.on('error', reject);
    });
  }

  /**
   * 停止 TCP 服务器
   */
  async stopServer(name: string): Promise<void> {
    const serverInfo = this.servers.get(name);
    if (!serverInfo) {
      throw new Error(`TCP server '${name}' not found`);
    }

    if (!serverInfo.isRunning) {
      this.logger.warn(`TCP server '${name}' is not running`);
      return;
    }

    return new Promise((resolve) => {
      serverInfo.server.close(() => {
        serverInfo.isRunning = false;
        this.logger.log(`TCP server '${name}' stopped`);
        resolve();
      });
    });
  }

  /**
   * 关闭 TCP 服务器
   */
  async closeServer(name: string): Promise<void> {
    const serverInfo = this.servers.get(name);
    if (!serverInfo) {
      throw new Error(`TCP server '${name}' not found`);
    }

    // 先停止服务器
    if (serverInfo.isRunning) {
      await this.stopServer(name);
    }

    // 关闭所有连接
    for (const connection of serverInfo.connections) {
      connection.socket.destroy();
    }

    this.servers.delete(name);
    this.logger.log(`TCP server '${name}' closed`);
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
   */
  createClient(name: string, config: TcpClientConfig): void {
    if (this.clients.has(name)) {
      throw new Error(`TCP client '${name}' already exists`);
    }

    const socket = new net.Socket();

    const clientInfo: TcpClientInfo = {
      name,
      config,
      socket,
      isConnected: false,
      reconnectAttempts: 0,
    };

    // 设置客户端事件处理器
    this.setupClientEventHandlers(clientInfo);

    // 添加到客户端列表
    this.clients.set(name, clientInfo);

    this.logger.log(`TCP client '${name}' created`);
  }

  /**
   * 设置客户端事件处理器
   */
  private setupClientEventHandlers(clientInfo: TcpClientInfo): void {
    const { name, socket, config } = clientInfo;

    socket.on('connect', () => {
      clientInfo.isConnected = true;
      clientInfo.reconnectAttempts = 0;
      this.logger.log(`TCP client '${name}' connected to ${config.host}:${config.port}`);
      this.emit('clientConnect', { name });
    });

    socket.on('data', (data) => {
      this.logger.debug(`TCP client '${name}' received data: ${data.length} bytes`);
      this.emit('clientData1', { name, data });
    });

    socket.on('end', () => {
      clientInfo.isConnected = false;
      this.logger.log(`TCP client '${name}' connection ended`);
      this.emit('clientEnd', { name });
    });

    socket.on('error', (err) => {
      clientInfo.isConnected = false;
      this.logger.error(`TCP client '${name}' error:`, err);
      this.emit('clientError', { name, error: err });
    });

    socket.on('close', (hadError) => {
      clientInfo.isConnected = false;
      this.logger.log(`TCP client '${name}' connection closed${hadError ? ' due to error' : ''}`);
      this.emit('clientClose', { name, hadError });

      // 自动重连
      if (config.reconnectInterval && config.maxReconnectAttempts) {
        this.scheduleReconnect(clientInfo);
      }
    });
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(clientInfo: TcpClientInfo): void {
    const { name, config } = clientInfo;

    if (clientInfo.reconnectAttempts >= (config.maxReconnectAttempts || 0)) {
      this.logger.warn(`TCP client '${name}' max reconnection attempts reached`);
      return;
    }

    if (clientInfo.reconnectTimer) {
      clearTimeout(clientInfo.reconnectTimer);
    }

    clientInfo.reconnectTimer = setTimeout(() => {
      clientInfo.reconnectAttempts++;
      this.logger.log(`TCP client '${name}' attempting to reconnect (${clientInfo.reconnectAttempts}/${config.maxReconnectAttempts})`);
      void this.connectClient(name);
    }, config.reconnectInterval || 5000);
  }

  /**
   * 连接 TCP 客户端
   */
  async connectClient(name: string): Promise<void> {
    const clientInfo = this.clients.get(name);
    if (!clientInfo) {
      throw new Error(`TCP client '${name}' not found`);
    }

    if (clientInfo.isConnected) {
      this.logger.warn(`TCP client '${name}' is already connected`);
      return;
    }

    const { socket, config } = clientInfo;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          reject(new Error(`TCP client '${name}' connection timeout`));
        },
        config.timeout || this.options.connectionTimeout || 30000,
      );

      socket.connect(config.port, config.host, () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  /**
   * 关闭 TCP 客户端
   */
  closeClient(name: string): void {
    const clientInfo = this.clients.get(name);
    if (!clientInfo) {
      throw new Error(`TCP client '${name}' not found`);
    }

    if (clientInfo.reconnectTimer) {
      clearTimeout(clientInfo.reconnectTimer);
    }

    clientInfo.socket.destroy();
    this.clients.delete(name);
    this.logger.log(`TCP client '${name}' closed`);
  }

  /**
   * 关闭所有 TCP 客户端
   */
  async closeAllClients(): Promise<void> {
    const promises = Array.from(this.clients.keys()).map((name) => this.closeClient(name));
    await Promise.all(promises);
  }

  /**
   * 发送消息到服务器连接
   */
  sendToServer(name: string, data: Buffer | string): void {
    const serverInfo = this.servers.get(name);
    if (!serverInfo) {
      throw new Error(`TCP server '${name}' not found`);
    }

    if (!serverInfo.isRunning) {
      throw new Error(`TCP server '${name}' is not running`);
    }

    // 发送给所有连接的客户端
    for (const connection of serverInfo.connections) {
      connection.socket.write(data);
    }
  }

  /**
   * 发送消息到客户端
   */
  sendToClient<T extends string>(name: T, data: Buffer | string): void {
    const clientInfo = this.clients.get(name);
    if (!clientInfo) {
      throw new Error(`TCP client '${name}' not found`);
    }

    if (!clientInfo.isConnected) {
      throw new Error(`TCP client '${name}' is not connected`);
    }

    clientInfo.socket.write(data);
  }

  /**
   * 发送消息到特定连接
   */
  sendToConnection(connectionId: string, data: Buffer | string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`TCP connection '${connectionId}' not found`);
    }

    connection.socket.write(data);
  }

  /**
   * 关闭特定连接
   */
  closeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`TCP connection '${connectionId}' not found`);
    }

    connection.socket.destroy();
    this.connections.delete(connectionId);

    // 从服务器的连接列表中移除
    if (connection.serverName) {
      const serverInfo = this.servers.get(connection.serverName);
      if (serverInfo) {
        serverInfo.connections = serverInfo.connections.filter((conn) => conn.id !== connectionId);
      }
    }
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat(): void {
    const interval = this.options.heartbeatInterval || 30000;

    // 服务器心跳
    for (const [name, serverInfo] of this.servers) {
      const timer = setInterval(() => {
        if (serverInfo.isRunning) {
          for (const connection of serverInfo.connections) {
            connection.socket.write(Buffer.from('ping'));
          }
        }
      }, interval);

      this.heartbeatTimers.set(`server_${name}`, timer);
    }

    // 客户端心跳
    for (const [name, clientInfo] of this.clients) {
      const timer = setInterval(() => {
        if (clientInfo.isConnected) {
          clientInfo.socket.write(Buffer.from('ping'));
        }
      }, interval);

      this.heartbeatTimers.set(`client_${name}`, timer);
    }
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    for (const timer of this.heartbeatTimers.values()) {
      clearInterval(timer);
    }
    this.heartbeatTimers.clear();
  }

  /**
   * 生成连接 ID
   */
  private generateConnectionId(): string {
    return `conn_${++this.connectionCounter}_${Date.now()}`;
  }

  // 查询方法
  getServerNames(): string[] {
    return Array.from(this.servers.keys());
  }

  getClientNames(): string[] {
    return Array.from(this.clients.keys());
  }

  getConnectionIds(): string[] {
    return Array.from(this.connections.keys());
  }

  hasServer(name: string): boolean {
    return this.servers.has(name);
  }

  hasClient(name: string): boolean {
    return this.clients.has(name);
  }

  hasConnection(connectionId: string): boolean {
    return this.connections.has(connectionId);
  }

  getServerInfo(name: string): TcpServerInfo | undefined {
    return this.servers.get(name);
  }

  getClientInfo(name: string): TcpClientInfo | undefined {
    return this.clients.get(name);
  }

  getConnectionInfo(connectionId: string): TcpConnection | undefined {
    return this.connections.get(connectionId);
  }
}
