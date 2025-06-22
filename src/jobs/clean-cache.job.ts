import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanCacheJob {
  private readonly logger = new Logger(CleanCacheJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCleanCache() {
    this.logger.log('开始清理缓存...');
    // 这里添加清理缓存的逻辑
    this.logger.log('缓存清理完成');
  }

  @Cron(CronExpression.EVERY_WEEK)
  handleWeeklyCleanup() {
    this.logger.log('开始每周清理任务...');
    // 这里添加每周清理的逻辑
    this.logger.log('每周清理任务完成');
  }
}
