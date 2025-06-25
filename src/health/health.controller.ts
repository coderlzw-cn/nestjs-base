import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://nest.nodejs.cn')]);
  }

  @Get('db')
  @HealthCheck()
  dbHealthCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('disk')
  @HealthCheck()
  check() {
    return this.health.check([() => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 })]);
  }

  @Get('memory')
  @HealthCheck()
  memoryHealthCheck() {
    return this.health.check([() => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024)]);
  }
}
