import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Request } from 'express';
import { WebSocket } from 'ws';
import { GatewaysService } from './gateways.service';

@WebSocketGateway({
  path: '/gateway',
})
export class GatewaysGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(GatewaysGateway.name);

  constructor(private readonly gatewaysService: GatewaysService) {}

  afterInit() {
    this.logger.log(`WebSocket server initialized`);
  }

  handleConnection(client: WebSocket, request: Request) {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    this.logger.log(`WebSocket client connected from IP: ${ip?.toString()}`);
  }

  handleDisconnect() {
    this.logger.log(`WebSocket client disconnected`);
  }
}
