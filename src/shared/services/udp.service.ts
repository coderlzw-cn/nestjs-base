import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as dgram from 'dgram';
import { EventEmitter } from 'events';
import { MODULE_OPTIONS_TOKEN, UdpModuleOptions } from '../nest-udp.module';

export interface UdpServerConfig {
  port: number;
  host?: string;
  reuseAddr?: boolean;
}

export interface UdpClientConfig {
  host: string;
  port: number;
  timeout?: number;
}

export interface UdpMessage {
  data: Buffer;
  remoteAddress: string;
  remotePort: number;
}

@Injectable()
export class UdpService extends EventEmitter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UdpService.name);
  private servers: Map<string, dgram.Socket> = new Map();
  private clients: Map<string, dgram.Socket> = new Map();
  private options: UdpModuleOptions;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: UdpModuleOptions) {
    super();
    this.options = options;
  }

  async onModuleInit() {
    this.logger.log('UDP Service initializing...');

    if (!this.options.enabled) {
      this.logger.log('UDP Service is disabled');
      return;
    }

    // 自动启动默认服务器
    if (this.options.autoStartServer && this.options.defaultServer) {
      try {
        await this.createServer('default', this.options.defaultServer);
        this.logger.log('Default UDP server started automatically');
      } catch (error) {
        this.logger.error('Failed to start default UDP server:', error);
      }
    }

    // 自动连接默认客户端
    if (this.options.autoConnectClient && this.options.defaultClient) {
      try {
        await this.createClient('default', this.options.defaultClient);
        this.logger.log('Default UDP client created automatically');
      } catch (error) {
        this.logger.error('Failed to create default UDP client:', error);
      }
    }

    this.logger.log('UDP Service initialized');
  }

  async onModuleDestroy() {
    this.logger.log('UDP Service destroying...');
    await this.closeAllServers();
    await this.closeAllClients();
  }

  /**
   * 创建 UDP 服务器
   * @param name 服务器名称
   * @param config 服务器配置
   * @returns Promise<void>
   */
  async createServer(name: string, config: UdpServerConfig): Promise<void> {
    if (this.servers.has(name)) {
      throw new Error(`UDP server '${name}' already exists`);
    }

    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
      this.logger.error(`UDP server '${name}' error:`, err);
      this.emit('serverError', { name, error: err });
    });

    server.on('message', (msg, rinfo) => {
      const message: UdpMessage = {
        data: msg,
        remoteAddress: rinfo.address,
        remotePort: rinfo.port,
      };

      this.logger.debug(`UDP server '${name}' received message from ${rinfo.address}:${rinfo.port}`);
      this.emit('message', { name, message });
    });

    server.on('listening', () => {
      const address = server.address();
      this.logger.log(`UDP server '${name}' listening on ${address.address}:${address.port}`);
      this.emit('listening', { name, address });
    });

    return new Promise((resolve, reject) => {
      server.bind(config.port, config.host || '0.0.0.0', () => {
        if (config.reuseAddr) {
          server.setBroadcast(true);
        }
        this.servers.set(name, server);
        resolve();
      });

      server.on('error', reject);
    });
  }

  /**
   * 关闭 UDP 服务器
   * @param name 服务器名称
   */
  async closeServer(name: string): Promise<void> {
    const server = this.servers.get(name);
    if (!server) {
      throw new Error(`UDP server '${name}' not found`);
    }

    return new Promise((resolve) => {
      server.close(() => {
        this.servers.delete(name);
        this.logger.log(`UDP server '${name}' closed`);
        resolve();
      });
    });
  }

  /**
   * 关闭所有 UDP 服务器
   */
  async closeAllServers(): Promise<void> {
    const promises = Array.from(this.servers.keys()).map((name) => this.closeServer(name));
    await Promise.all(promises);
  }

  /**
   * 创建 UDP 客户端
   * @param name 客户端名称
   * @param config 客户端配置
   * @returns Promise<void>
   */
  async createClient(name: string, config: UdpClientConfig): Promise<void> {
    if (this.clients.has(name)) {
      throw new Error(`UDP client '${name}' already exists`);
    }

    const client = dgram.createSocket('udp4');

    client.on('error', (err) => {
      this.logger.error(`UDP client '${name}' error:`, err);
      this.emit('clientError', { name, error: err });
    });

    client.on('message', (msg, rinfo) => {
      const message: UdpMessage = {
        data: msg,
        remoteAddress: rinfo.address,
        remotePort: rinfo.port,
      };

      this.logger.debug(`UDP client '${name}' received message from ${rinfo.address}:${rinfo.port}`);
      this.emit('clientMessage', { name, message });
    });

    this.clients.set(name, client);
    this.logger.log(`UDP client '${name}' created for ${config.host}:${config.port}`);
  }

  /**
   * 发送 UDP 消息
   * @param name 客户端名称
   * @param data 要发送的数据
   * @param config 目标配置
   * @returns Promise<void>
   */
  async sendMessage(name: string, data: Buffer | string, config: UdpClientConfig): Promise<void> {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`UDP client '${name}' not found`);
    }

    const message = typeof data === 'string' ? Buffer.from(data) : data;

    return new Promise((resolve, reject) => {
      client.send(message, config.port, config.host, (err) => {
        if (err) {
          this.logger.error(`UDP client '${name}' send error:`, err);
          reject(err);
        } else {
          this.logger.debug(`UDP client '${name}' sent message to ${config.host}:${config.port}`);
          resolve();
        }
      });
    });
  }

  /**
   * 关闭 UDP 客户端
   * @param name 客户端名称
   */
  async closeClient(name: string): Promise<void> {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`UDP client '${name}' not found`);
    }

    return new Promise((resolve) => {
      client.close(() => {
        this.clients.delete(name);
        this.logger.log(`UDP client '${name}' closed`);
        resolve();
      });
    });
  }

  /**
   * 关闭所有 UDP 客户端
   */
  async closeAllClients(): Promise<void> {
    const promises = Array.from(this.clients.keys()).map((name) => this.closeClient(name));
    await Promise.all(promises);
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
   * 获取模块配置
   */
  getOptions(): UdpModuleOptions {
    return this.options;
  }
}
