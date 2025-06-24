import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UdpService } from '../services/udp.service';

export class CreateUdpServerDto {
  port: number;
  host?: string;
  reuseAddr?: boolean;
}

export class CreateUdpClientDto {
  host: string;
  port: number;
  timeout?: number;
}

export class SendMessageDto {
  data: string;
  host: string;
  port: number;
}

@ApiTags('UDP')
@Controller('udp')
export class UdpController {
  constructor(private readonly udpService: UdpService) {}

  @Post('servers/:name')
  @ApiOperation({ summary: '创建 UDP 服务器' })
  @ApiResponse({ status: 201, description: '服务器创建成功' })
  async createServer(@Param('name') name: string, @Body() config: CreateUdpServerDto) {
    await this.udpService.createServer(name, config);
    return { message: `UDP server '${name}' created successfully` };
  }

  @Delete('servers/:name')
  @ApiOperation({ summary: '关闭 UDP 服务器' })
  @ApiResponse({ status: 200, description: '服务器关闭成功' })
  async closeServer(@Param('name') name: string) {
    await this.udpService.closeServer(name);
    return { message: `UDP server '${name}' closed successfully` };
  }

  @Get('servers')
  @ApiOperation({ summary: '获取所有 UDP 服务器' })
  @ApiResponse({ status: 200, description: '获取服务器列表成功' })
  getServers() {
    const servers = this.udpService.getServerNames();
    return { servers };
  }

  @Post('clients/:name')
  @ApiOperation({ summary: '创建 UDP 客户端' })
  @ApiResponse({ status: 201, description: '客户端创建成功' })
  async createClient(@Param('name') name: string, @Body() config: CreateUdpClientDto) {
    await this.udpService.createClient(name, config);
    return { message: `UDP client '${name}' created successfully` };
  }

  @Delete('clients/:name')
  @ApiOperation({ summary: '关闭 UDP 客户端' })
  @ApiResponse({ status: 200, description: '客户端关闭成功' })
  async closeClient(@Param('name') name: string) {
    await this.udpService.closeClient(name);
    return { message: `UDP client '${name}' closed successfully` };
  }

  @Get('clients')
  @ApiOperation({ summary: '获取所有 UDP 客户端' })
  @ApiResponse({ status: 200, description: '获取客户端列表成功' })
  getClients() {
    const clients = this.udpService.getClientNames();
    return { clients };
  }

  @Post('clients/:name/send')
  @ApiOperation({ summary: '发送 UDP 消息' })
  @ApiResponse({ status: 200, description: '消息发送成功' })
  async sendMessage(@Param('name') name: string, @Body() messageDto: SendMessageDto) {
    await this.udpService.sendMessage(name, messageDto.data, {
      host: messageDto.host,
      port: messageDto.port,
    });
    return { message: 'Message sent successfully' };
  }

  @Get('config')
  @ApiOperation({ summary: '获取 UDP 模块配置' })
  @ApiResponse({ status: 200, description: '获取配置成功' })
  getConfig() {
    return this.udpService.getOptions();
  }
}
