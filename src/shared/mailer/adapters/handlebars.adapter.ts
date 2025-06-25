import { Logger } from '@nestjs/common';
import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';

export interface Adapter {
  logger: Logger;
  compile: (template: string, data: Record<string, any>) => string;
}

export class BaseAdapter implements Adapter {
  readonly logger: Logger = new Logger(BaseAdapter.name);

  /**
   * Render template
   * @param template Template path
   * @param data Data
   */
  compile(template: string, data: Record<string, any>) {
    try {
      const result = Handlebars.compile(readFileSync(template, 'utf-8'))(data);
      this.logger.debug(`✅ Template rendered successfully: ${template}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Template compilation failed (${template}): ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
