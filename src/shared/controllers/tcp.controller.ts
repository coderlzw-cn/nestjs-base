// import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { TcpService } from '../tcp/tcp.service';
//
// export class CreateTcpServerDto {
//   port: number;
//   host?: string;
//   backlog?: number;
// }
//
// export class CreateTcpClientDto {
//   host: string;
//   port: number;
//   timeout?: number;
//   keepAlive?: boolean;
// }
//
// export class ConnectClientDto {
//   host: string;
//   port: number;
// }
//
// export class SendMessageDto {
//   data: string;
// }
//
// export class SendToConnectionDto {
//   data: string;
// }
//
// @ApiTags('TCP')
// @Controller('tcp')
// export class TcpController {
//   constructor(private readonly tcpService: TcpService) {}
//
//   @Post('servers/:name')
//   @ApiOperation({ summary: '创建 TCP 服务器' })
//   @ApiResponse({ status: 201, description: '服务器创建成功' })
//   async createServer(@Param('name') name: string, @Body() config: CreateTcpServerDto) {
//     await this.tcpService.createServer(name, config);
//     return { message: `TCP server '${name}' created successfully` };
//   }
//
//   @Delete('servers/:name')
//   @ApiOperation({ summary: '关闭 TCP 服务器' })
//   @ApiResponse({ status: 200, description: '服务器关闭成功' })
//   async closeServer(@Param('name') name: string) {
//     await this.tcpService.closeServer(name);
//     return { message: `TCP server '${name}' closed successfully` };
//   }
//
//   @Get('servers')
//   @ApiOperation({ summary: '获取所有 TCP 服务器' })
//   @ApiResponse({ status: 200, description: '获取服务器列表成功' })
//   getServers() {
//     const servers = this.tcpService.getServerNames();
//     return { servers };
//   }
//
//   @Post('clients/:name')
//   @ApiOperation({ summary: '创建 TCP 客户端' })
//   @ApiResponse({ status: 201, description: '客户端创建成功' })
//   createClient(@Param('name') name: string, @Body() config: CreateTcpClientDto) {
//     this.tcpService.createClient(name, config);
//     return { message: `TCP client '${name}' created successfully` };
//   }
//
//   @Post('clients/:name/connect')
//   @ApiOperation({ summary: '连接 TCP 客户端' })
//   @ApiResponse({ status: 200, description: '客户端连接成功' })
//   async connectClient(@Param('name') name: string) {
//     await this.tcpService.connectClient(name);
//     return { message: `TCP client '${name}' connected successfully` };
//   }
//
//   @Delete('clients/:name')
//   @ApiOperation({ summary: '关闭 TCP 客户端' })
//   @ApiResponse({ status: 200, description: '客户端关闭成功' })
//   async closeClient(@Param('name') name: string) {
//     await this.tcpService.closeClient(name);
//     return { message: `TCP client '${name}' closed successfully` };
//   }
//
//   @Get('clients')
//   @ApiOperation({ summary: '获取所有 TCP 客户端' })
//   @ApiResponse({ status: 200, description: '获取客户端列表成功' })
//   getClients() {
//     const clients = this.tcpService.getClientNames();
//     return { clients };
//   }
//
//   @Post('clients/:name/send')
//   @ApiOperation({ summary: '发送 TCP 消息' })
//   @ApiResponse({ status: 200, description: '消息发送成功' })
//   sendMessage(@Param('name') name: string, @Body() messageDto: SendMessageDto) {
//     // await this.tcpService.sendMessage(name, messageDto.data);
//     return { message: 'Message sent successfully' };
//   }
//
//   @Post('connections/:connectionId/send')
//   @ApiOperation({ summary: '向特定连接发送消息' })
//   @ApiResponse({ status: 200, description: '消息发送成功' })
//   sendToConnection(@Param('connectionId') connectionId: string, @Body() messageDto: SendToConnectionDto) {
//     // await this.tcpService.sendToConnection(connectionId, messageDto.data);
//     return { message: 'Message sent to connection successfully' };
//   }
//
//   @Delete('connections/:connectionId')
//   @ApiOperation({ summary: '关闭特定连接' })
//   @ApiResponse({ status: 200, description: '连接关闭成功' })
//   async closeConnection(@Param('connectionId') connectionId: string) {
//     await this.tcpService.closeConnection(connectionId);
//     return { message: `Connection '${connectionId}' closed successfully` };
//   }
//
//   @Get('connections')
//   @ApiOperation({ summary: '获取所有连接' })
//   @ApiResponse({ status: 200, description: '获取连接列表成功' })
//   getConnections() {
//     const connections = this.tcpService.getConnectionIds();
//     return { connections };
//   }
//
//   @Get('config')
//   @ApiOperation({ summary: '获取 TCP 模块配置' })
//   @ApiResponse({ status: 200, description: '获取配置成功' })
//   getConfig() {
//     return this.tcpService.getOptions();
//   }
// }
