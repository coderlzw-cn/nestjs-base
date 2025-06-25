# TCP 模块使用指南

## 概述

TCP 模块使用 NestJS 11 的 `ConfigurableModuleBuilder` 实现，支持多服务器和多客户端管理，提供自动启动、自动连接、心跳检测等功能。

## 主要特性

- ✅ **多服务器支持**: 每个模块可以注册多个 TCP 服务器
- ✅ **多客户端支持**: 每个模块可以注册多个 TCP 客户端
- ✅ **自动启动**: 支持自动启动服务器和连接客户端
- ✅ **心跳检测**: 可配置的心跳机制保持连接活跃
- ✅ **自动重连**: 客户端支持自动重连机制
- ✅ **事件驱动**: 基于 EventEmitter 的事件系统
- ✅ **类型安全**: 完整的 TypeScript 类型支持

## 基本用法

### 1. 简单配置

```typescript
import { Module } from '@nestjs/common';
import { TcpModule } from './shared/tcp';

@Module({
  imports: [
    TcpModule.forRoot({
      // 默认服务器配置
      defaultServer: {
        port: 3001,
        host: '0.0.0.0',
        autoStart: true, // 自动启动
      },
      // 默认客户端配置
      defaultClient: {
        host: 'localhost',
        port: 3002,
        autoConnect: true, // 自动连接
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
      },
      // 自动启动所有服务器
      autoStartAllServers: true,
      // 自动连接所有客户端
      autoConnectAllClients: true,
      // 启用心跳检测
      enableHeartbeat: true,
      heartbeatInterval: 30000,
    }),
  ],
})
export class AppModule {
}
```

### 2. 多服务器和多客户端配置

```typescript
import { Module } from '@nestjs/common';
import { TcpModule } from './shared/tcp';

@Module({
  imports: [
    TcpModule.forRoot({
      // 多个服务器配置
      servers: {
        'api-server': {
          port: 3001,
          host: '0.0.0.0',
          autoStart: true,
        },
        'data-server': {
          port: 3002,
          host: '0.0.0.0',
          autoStart: true,
        },
        'monitor-server': {
          port: 3003,
          host: '0.0.0.0',
          autoStart: false, // 手动启动
        },
      },
      // 多个客户端配置
      clients: {
        'redis-client': {
          host: 'localhost',
          port: 6379,
          autoConnect: true,
          reconnectInterval: 5000,
          maxReconnectAttempts: 10,
        },
        'database-client': {
          host: 'localhost',
          port: 5432,
          autoConnect: true,
          timeout: 10000,
        },
        'external-api-client': {
          host: 'api.example.com',
          port: 8080,
          autoConnect: false, // 手动连接
          keepAlive: true,
        },
      },
      // 全局配置
      autoStartAllServers: true,
      autoConnectAllClients: true,
      enableHeartbeat: true,
      heartbeatInterval: 30000,
      connectionTimeout: 30000,
      maxConnections: 1000,
    }),
  ],
})
export class AppModule {
}
```

### 3. 异步配置

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TcpModule } from './shared/tcp';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TcpModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        servers: {
          'api-server': {
            port: configService.get('TCP_API_PORT', 3001),
            host: configService.get('TCP_API_HOST', '0.0.0.0'),
            autoStart: true,
          },
        },
        clients: {
          'redis-client': {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
            autoConnect: true,
          },
        },
        enableHeartbeat: configService.get('TCP_HEARTBEAT_ENABLED', true),
        heartbeatInterval: configService.get('TCP_HEARTBEAT_INTERVAL', 30000),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
}
```

## 使用 TCP 服务

### 1. 注入和使用服务

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TcpService } from './shared/tcp';

@Injectable()
export class MyService implements OnModuleInit {
  constructor(private readonly tcpService: TcpService) {
  }

  onModuleInit() {
    // 监听事件
    this.tcpService.on('data', ({ name, message }) => {
      console.log(`Received data from ${name}:`, message.data.toString());
    });

    this.tcpService.on('clientConnect', ({ name }) => {
      console.log(`Client ${name} connected`);
    });

    this.tcpService.on('listening', ({ name, address }) => {
      console.log(`Server ${name} listening on ${address.address}:${address.port}`);
    });
  }

  // 发送消息到客户端
  sendToClient(clientName: string, message: string) {
    this.tcpService.sendToClient(clientName, message);
  }

  // 发送消息到服务器
  sendToServer(serverName: string, message: string) {
    this.tcpService.sendToServer(serverName, message);
  }

  // 发送消息到特定连接
  sendToConnection(connectionId: string, message: string) {
    this.tcpService.sendToConnection(connectionId, message);
  }

  // 手动启动服务器
  async startServer(name: string) {
    await this.tcpService.startServer(name);
  }

  // 手动连接客户端
  async connectClient(name: string) {
    await this.tcpService.connectClient(name);
  }

  // 获取服务器信息
  getServerInfo(name: string) {
    return this.tcpService.getServerInfo(name);
  }

  // 获取客户端信息
  getClientInfo(name: string) {
    return this.tcpService.getClientInfo(name);
  }
}
```

### 2. 事件监听

```typescript
// 服务器事件
tcpService.on('listening', ({ name, address }) => {
  console.log(`Server ${name} started on ${address.address}:${address.port}`);
});

tcpService.on('connection', ({ name, connection }) => {
  console.log(`New connection to server ${name}: ${connection.id}`);
});

tcpService.on('data', ({ name, message }) => {
  console.log(`Data received on server ${name}: ${message.data.toString()}`);
});

tcpService.on('connectionEnd', ({ name, connectionId }) => {
  console.log(`Connection ${connectionId} ended on server ${name}`);
});

// 客户端事件
tcpService.on('clientConnect', ({ name }) => {
  console.log(`Client ${name} connected`);
});

tcpService.on('clientData', ({ name, data }) => {
  console.log(`Data received from client ${name}: ${data.toString()}`);
});

tcpService.on('clientClose', ({ name, hadError }) => {
  console.log(`Client ${name} closed${hadError ? ' due to error' : ''}`);
});
```

## 配置选项

### TcpServerConfig

| 选项          | 类型      | 默认值       | 描述        |
|-------------|---------|-----------|-----------|
| `port`      | number  | -         | 服务器端口（必需） |
| `host`      | string  | '0.0.0.0' | 服务器地址     |
| `backlog`   | number  | 511       | 连接队列长度    |
| `autoStart` | boolean | false     | 是否自动启动    |

### TcpClientConfig

| 选项                     | 类型      | 默认值   | 描述        |
|------------------------|---------|-------|-----------|
| `host`                 | string  | -     | 服务器地址（必需） |
| `port`                 | number  | -     | 服务器端口（必需） |
| `timeout`              | number  | 30000 | 连接超时时间    |
| `keepAlive`            | boolean | false | 是否保持连接    |
| `autoConnect`          | boolean | false | 是否自动连接    |
| `reconnectInterval`    | number  | 5000  | 重连间隔      |
| `maxReconnectAttempts` | number  | 10    | 最大重连次数    |

### TcpModuleOptions

| 选项                      | 类型                              | 默认值       | 描述          |
|-------------------------|---------------------------------|-----------|-------------|
| `defaultServer`         | TcpServerConfig                 | undefined | 默认服务器配置     |
| `defaultClient`         | TcpClientConfig                 | undefined | 默认客户端配置     |
| `servers`               | Record<string, TcpServerConfig> | undefined | 多个服务器配置     |
| `clients`               | Record<string, TcpClientConfig> | undefined | 多个客户端配置     |
| `autoStartServer`       | boolean                         | false     | 是否自动启动默认服务器 |
| `autoConnectClient`     | boolean                         | false     | 是否自动连接默认客户端 |
| `autoStartAllServers`   | boolean                         | false     | 是否自动启动所有服务器 |
| `autoConnectAllClients` | boolean                         | false     | 是否自动连接所有客户端 |
| `logLevel`              | string                          | 'info'    | 日志级别        |
| `connectionTimeout`     | number                          | 30000     | 连接超时时间      |
| `maxConnections`        | number                          | 1000      | 最大连接数       |
| `heartbeatInterval`     | number                          | 30000     | 心跳间隔        |
| `enableHeartbeat`       | boolean                         | false     | 是否启用心跳      |

## 可用方法

### 服务器管理

- `createServer(name, config)`: 创建服务器
- `startServer(name)`: 启动服务器
- `stopServer(name)`: 停止服务器
- `closeServer(name)`: 关闭服务器
- `closeAllServers()`: 关闭所有服务器

### 客户端管理

- `createClient(name, config)`: 创建客户端
- `connectClient(name)`: 连接客户端
- `closeClient(name)`: 关闭客户端
- `closeAllClients()`: 关闭所有客户端

### 消息发送

- `sendToServer(name, data)`: 发送消息到服务器
- `sendToClient(name, data)`: 发送消息到客户端
- `sendToConnection(connectionId, data)`: 发送消息到特定连接

### 查询方法

- `getServerNames()`: 获取所有服务器名称
- `getClientNames()`: 获取所有客户端名称
- `getConnectionIds()`: 获取所有连接ID
- `getServerInfo(name)`: 获取服务器信息
- `getClientInfo(name)`: 获取客户端信息
- `getConnectionInfo(connectionId)`: 获取连接信息
- `hasServer(name)`: 检查服务器是否存在
- `hasClient(name)`: 检查客户端是否存在
- `hasConnection(connectionId)`: 检查连接是否存在 

# TCP 服务事件类型系统

本模块为 TCP 服务提供了完整的 TypeScript 类型支持，包括所有事件的类型定义。

## 文件结构

- `tcp.service.ts` - 主要的 TCP 服务实现
- `tcp-events.interface.ts` - 事件类型定义
- `tcp-options.interface.ts` - 配置选项类型定义
- `tcp.module-definition.ts` - 模块定义

## 事件类型

### 服务器相关事件

```typescript
// 服务器开始监听
tcpService.on('listening', (event: TcpListeningEvent) => {
  console.log(`服务器 ${event.name} 正在监听 ${event.address.address}:${event.address.port}`);
});

// 服务器错误
tcpService.on('serverError', (event: TcpServerErrorEvent) => {
  console.error(`服务器 ${event.name} 发生错误:`, event.error.message);
});
```

### 连接相关事件

```typescript
// 新连接建立
tcpService.on('connection', (event: TcpConnectionEvent) => {
  const { name, connection } = event;
  console.log(`服务器 ${name} 收到新连接: ${connection.id}`);
  console.log(`远程地址: ${connection.remoteAddress}:${connection.remotePort}`);
});

// 连接结束
tcpService.on('connectionEnd', (event: TcpConnectionEndEvent) => {
  console.log(`连接 ${event.connectionId} 已结束`);
});

// 连接错误
tcpService.on('connectionError', (event: TcpConnectionErrorEvent) => {
  console.error(`连接 ${event.connectionId} 发生错误:`, event.error.message);
});
```

### 数据相关事件

```typescript
// 接收数据
tcpService.on('data', (event: TcpDataEvent) => {
  const { name, message } = event;
  console.log(`服务器 ${name} 收到数据:`, {
    connectionId: message.connectionId,
    dataLength: message.data.length,
    data: message.data.toString('utf8'),
  });
});
```

### 客户端相关事件

```typescript
// 客户端连接
tcpService.on('clientConnect', (event: TcpClientConnectEvent) => {
  console.log(`客户端 ${event.name} 已连接`);
});

// 客户端接收数据
tcpService.on('clientData', (event: TcpClientDataEvent) => {
  const { name, data } = event;
  console.log(`客户端 ${name} 收到数据:`, {
    dataLength: data.length,
    data: data.toString('utf8'),
  });
});

// 客户端连接结束
tcpService.on('clientEnd', (event: TcpClientEndEvent) => {
  console.log(`客户端 ${event.name} 连接已结束`);
});

// 客户端错误
tcpService.on('clientError', (event: TcpClientErrorEvent) => {
  console.error(`客户端 ${event.name} 发生错误:`, event.error.message);
});

// 客户端连接关闭
tcpService.on('clientClose', (event: TcpClientCloseEvent) => {
  console.log(`客户端 ${event.name} 连接已关闭${event.hadError ? '（由于错误）' : ''}`);
});
```

## 类型安全的事件监听

所有事件都有完整的 TypeScript 类型支持，这意味着：

1. **自动补全**: IDE 会自动提示可用的事件名称
2. **类型检查**: 事件参数有正确的类型定义
3. **错误预防**: 编译时检查事件名称和参数类型
4. **文档支持**: 每个事件都有清晰的类型定义

## 使用示例

```typescript
import { Injectable } from '@nestjs/common';
import { TcpService } from './tcp.service';
import { TcpDataEvent, TcpConnectionEvent } from './tcp-events.interface';

@Injectable()
export class MyService {
  constructor(private readonly tcpService: TcpService) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 类型安全的事件监听
    this.tcpService.on('data', (event: TcpDataEvent) => {
      // event 参数有完整的类型支持
      const { name, message } = event;
      console.log(`收到来自 ${name} 的数据:`, message.data);
    });

    this.tcpService.on('connection', (event: TcpConnectionEvent) => {
      // connection 对象有完整的类型定义
      const { connection } = event;
      console.log(`新连接: ${connection.id} from ${connection.remoteAddress}`);
    });
  }
}
```

## 事件类型定义

所有事件类型都在 `tcp-events.interface.ts` 文件中定义：

- `TcpListeningEvent` - 服务器监听事件
- `TcpServerErrorEvent` - 服务器错误事件
- `TcpConnectionEvent` - 新连接事件
- `TcpConnectionEndEvent` - 连接结束事件
- `TcpConnectionErrorEvent` - 连接错误事件
- `TcpDataEvent` - 数据接收事件
- `TcpClientConnectEvent` - 客户端连接事件
- `TcpClientDataEvent` - 客户端数据接收事件
- `TcpClientEndEvent` - 客户端连接结束事件
- `TcpClientErrorEvent` - 客户端错误事件
- `TcpClientCloseEvent` - 客户端连接关闭事件

## 配置选项

TCP 服务的配置选项在 `tcp-options.interface.ts` 中定义，包括：

- 服务器配置 (`TcpServerConfig`)
- 客户端配置 (`TcpClientConfig`)
- 模块选项 (`TcpModuleOptions`)

这些配置选项也都有完整的 TypeScript 类型支持。 