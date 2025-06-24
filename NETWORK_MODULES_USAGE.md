# 网络模块使用指南

## 概述

在 `shared` 目录下创建了可配置的 TCP 和 UDP 动态模块，这些模块可以作为可复用的模块注册到其他模块中使用。

## 模块特性

### 1. 动态配置
- 支持运行时配置
- 可配置的服务器和客户端选项
- 自动启动/连接功能
- 灵活的日志级别控制

### 2. 事件驱动
- 基于 EventEmitter 的事件系统
- 支持自定义事件监听
- 完整的错误处理

### 3. HTTP API
- 完整的 RESTful API
- Swagger 文档支持
- 实时状态查询

## UDP 模块

### 基本使用

```typescript
import { Module } from '@nestjs/common';
import { NestUdpModule } from '../shared/nest-udp.module';

@Module({
  imports: [
    NestUdpModule.forRoot({
      enabled: true,
      defaultServer: {
        port: 8080,
        host: '0.0.0.0',
        reuseAddr: true,
      },
      autoStartServer: true,
      logLevel: 'info',
    }),
  ],
})
export class AppModule {}
```

### 高级配置

```typescript
import { Module } from '@nestjs/common';
import { NestUdpModule } from '../shared/nest-udp.module';

@Module({
  imports: [
    NestUdpModule.forRoot({
      enabled: true,
      defaultServer: {
        port: 8080,
        host: '0.0.0.0',
        reuseAddr: true,
      },
      defaultClient: {
        host: '127.0.0.1',
        port: 8081,
        timeout: 5000,
      },
      autoStartServer: true,
      autoConnectClient: true,
      logLevel: 'debug',
    }),
  ],
})
export class AppModule {}
```

### 在服务中使用

```typescript
import { Injectable } from '@nestjs/common';
import { UdpService } from '../shared/services/udp.service';

@Injectable()
export class MyService {
  constructor(private readonly udpService: UdpService) {
    // 监听 UDP 消息
    this.udpService.on('message', ({ name, message }) => {
      console.log(`UDP server '${name}' received:`, message.data.toString());
    });

    // 监听服务器错误
    this.udpService.on('serverError', ({ name, error }) => {
      console.error(`UDP server '${name}' error:`, error);
    });
  }

  async sendUdpMessage() {
    await this.udpService.sendMessage('default', 'Hello UDP!', {
      host: '127.0.0.1',
      port: 8080,
    });
  }
}
```

## TCP 模块

### 基本使用

```typescript
import { Module } from '@nestjs/common';
import { NestTcpModule } from '../shared/nest-tcp.module';

@Module({
  imports: [
    NestTcpModule.forRoot({
      enabled: true,
      defaultServer: {
        port: 3000,
        host: '0.0.0.0',
        backlog: 511,
      },
      autoStartServer: true,
      connectionTimeout: 30000,
      maxConnections: 1000,
    }),
  ],
})
export class AppModule {}
```

### 高级配置

```typescript
import { Module } from '@nestjs/common';
import { NestTcpModule } from '../shared/nest-tcp.module';

@Module({
  imports: [
    NestTcpModule.forRoot({
      enabled: true,
      defaultServer: {
        port: 3000,
        host: '0.0.0.0',
        backlog: 511,
      },
      defaultClient: {
        host: '127.0.0.1',
        port: 3001,
        timeout: 5000,
        keepAlive: true,
      },
      autoStartServer: true,
      autoConnectClient: true,
      connectionTimeout: 30000,
      maxConnections: 1000,
      logLevel: 'debug',
    }),
  ],
})
export class AppModule {}
```

### 在服务中使用

```typescript
import { Injectable } from '@nestjs/common';
import { TcpService } from '../shared/services/tcp.service';

@Injectable()
export class MyService {
  constructor(private readonly tcpService: TcpService) {
    // 监听 TCP 连接
    this.tcpService.on('connection', ({ name, connection }) => {
      console.log(`TCP server '${name}' new connection:`, connection.id);
    });

    // 监听 TCP 数据
    this.tcpService.on('data', ({ name, message }) => {
      console.log(`TCP server '${name}' received:`, message.data.toString());
    });

    // 监听客户端连接
    this.tcpService.on('clientConnect', ({ name }) => {
      console.log(`TCP client '${name}' connected`);
    });
  }

  async sendTcpMessage() {
    await this.tcpService.sendMessage('default', 'Hello TCP!');
  }

  async sendToConnection(connectionId: string) {
    await this.tcpService.sendToConnection(connectionId, 'Hello specific connection!');
  }
}
```

## HTTP API 使用

### UDP API

```bash
# 创建 UDP 服务器
POST /udp/servers/my-server
{
  "port": 8080,
  "host": "0.0.0.0",
  "reuseAddr": true
}

# 创建 UDP 客户端
POST /udp/clients/my-client
{
  "host": "127.0.0.1",
  "port": 8080,
  "timeout": 5000
}

# 发送 UDP 消息
POST /udp/clients/my-client/send
{
  "data": "Hello UDP!",
  "host": "127.0.0.1",
  "port": 8080
}

# 获取服务器列表
GET /udp/servers

# 获取客户端列表
GET /udp/clients

# 获取配置
GET /udp/config
```

### TCP API

```bash
# 创建 TCP 服务器
POST /tcp/servers/my-server
{
  "port": 3000,
  "host": "0.0.0.0",
  "backlog": 511
}

# 创建 TCP 客户端
POST /tcp/clients/my-client
{
  "host": "127.0.0.1",
  "port": 3000,
  "timeout": 5000,
  "keepAlive": true
}

# 连接 TCP 客户端
POST /tcp/clients/my-client/connect
{
  "host": "127.0.0.1",
  "port": 3000
}

# 发送 TCP 消息
POST /tcp/clients/my-client/send
{
  "data": "Hello TCP!"
}

# 向特定连接发送消息
POST /tcp/connections/conn_1_1234567890/send
{
  "data": "Hello specific connection!"
}

# 获取服务器列表
GET /tcp/servers

# 获取客户端列表
GET /tcp/clients

# 获取连接列表
GET /tcp/connections

# 获取配置
GET /tcp/config
```

## 事件监听

### UDP 事件

```typescript
// 服务器事件
udpService.on('listening', ({ name, address }) => {
  console.log(`UDP server '${name}' listening on ${address.address}:${address.port}`);
});

udpService.on('message', ({ name, message }) => {
  console.log(`UDP server '${name}' received message from ${message.remoteAddress}:${message.remotePort}`);
});

udpService.on('serverError', ({ name, error }) => {
  console.error(`UDP server '${name}' error:`, error);
});

// 客户端事件
udpService.on('clientMessage', ({ name, message }) => {
  console.log(`UDP client '${name}' received message from ${message.remoteAddress}:${message.remotePort}`);
});

udpService.on('clientError', ({ name, error }) => {
  console.error(`UDP client '${name}' error:`, error);
});
```

### TCP 事件

```typescript
// 服务器事件
tcpService.on('listening', ({ name, address }) => {
  console.log(`TCP server '${name}' listening on ${address.address}:${address.port}`);
});

tcpService.on('connection', ({ name, connection }) => {
  console.log(`TCP server '${name}' new connection: ${connection.id}`);
});

tcpService.on('data', ({ name, message }) => {
  console.log(`TCP server '${name}' received data from ${message.connectionId}`);
});

tcpService.on('connectionEnd', ({ name, connectionId }) => {
  console.log(`TCP server '${name}' connection ended: ${connectionId}`);
});

tcpService.on('serverError', ({ name, error }) => {
  console.error(`TCP server '${name}' error:`, error);
});

// 客户端事件
tcpService.on('clientConnect', ({ name }) => {
  console.log(`TCP client '${name}' connected`);
});

tcpService.on('clientData', ({ name, data }) => {
  console.log(`TCP client '${name}' received data: ${data.length} bytes`);
});

tcpService.on('clientEnd', ({ name }) => {
  console.log(`TCP client '${name}' connection ended`);
});

tcpService.on('clientError', ({ name, error }) => {
  console.error(`TCP client '${name}' error:`, error);
});
```

## 最佳实践

### 1. 错误处理
```typescript
// 始终监听错误事件
udpService.on('serverError', ({ name, error }) => {
  // 记录错误日志
  logger.error(`UDP server '${name}' error:`, error);
  
  // 尝试重启服务器
  if (error.code === 'EADDRINUSE') {
    // 处理端口占用错误
  }
});
```

### 2. 资源管理
```typescript
// 在模块销毁时清理资源
async onModuleDestroy() {
  await this.udpService.closeAllServers();
  await this.udpService.closeAllClients();
}
```

### 3. 配置管理
```typescript
// 使用环境变量进行配置
NestUdpModule.forRoot({
  enabled: process.env.UDP_ENABLED === 'true',
  defaultServer: {
    port: parseInt(process.env.UDP_PORT) || 8080,
    host: process.env.UDP_HOST || '0.0.0.0',
  },
  logLevel: process.env.UDP_LOG_LEVEL || 'info',
})
```

### 4. 性能优化
```typescript
// 限制连接数
NestTcpModule.forRoot({
  maxConnections: 1000,
  connectionTimeout: 30000,
})
```

这些网络模块提供了完整的 TCP 和 UDP 功能，支持动态配置、事件驱动和 HTTP API，可以轻松集成到任何 NestJS 应用中。 