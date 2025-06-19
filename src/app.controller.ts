import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TransformInterceptor } from './interceptor/transform.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  async getHello() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return TransformInterceptor.success(['item1', 'item2']);
  }
}
