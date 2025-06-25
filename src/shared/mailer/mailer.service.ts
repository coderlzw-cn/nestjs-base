import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { catchError, from, lastValueFrom, mergeMap, of, retry, tap, throwError, timer } from 'rxjs';
import { BaseAdapter } from './adapters/handlebars.adapter';
import { MODULE_OPTIONS_TOKEN } from './mail.module-definition';
import { MailModuleOptions } from './mailer.options';

interface MailOptions extends Partial<SendMailOptions> {
  template: string;
  replacements: Record<string, string>;
}

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;
  private readonly logger: Logger = new Logger(MailerService.name);
  private readonly adapter: BaseAdapter;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: MailModuleOptions) {
    this.adapter = new BaseAdapter();
    this.transporter = createTransport({
      host: this.options.credentials.host,
      port: this.options.credentials.port,
      secure: false,
      auth: {
        user: this.options.credentials.username,
        pass: this.options.credentials.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // 检查连接
  async checkConnection() {
    const retryAttempts = this.options.retryAttempts || 3;
    const retryDelay = this.options.retryDelay || 2000;

    this.logger.log('📨 Checking email server connection...');

    const observable$ = from(this.transporter.verify()).pipe(
      tap(() => this.logger.log('✅ Email server connection successful')),
      retry({
        count: retryAttempts,
        delay: (error, retryCount) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`❌ Email server connection failed, retrying... (${retryCount}/${retryAttempts}) Error: ${errorMessage}`);
          return timer(retryDelay);
        },
      }),
      catchError((error: Error) => {
        this.logger.error(`❌ Email server connection failed (retried ${retryAttempts} times): ${error.message}`);
        return throwError(() => error);
      }),
    );

    await to(lastValueFrom(observable$));
  }

  sendMail(mailOptions: MailOptions) {
    const promise = this.adapter.compile(mailOptions.template, mailOptions.replacements);
    return of(promise).pipe(
      mergeMap((html) => {
        mailOptions.html = html;
        mailOptions.from = mailOptions.from ?? this.options.credentials.username;

        let retryCount = 0; // 记录重试次数
        const sendMailPromise = this.transporter.sendMail(mailOptions);
        return from(sendMailPromise).pipe(
          tap({
            error: (err: Error) => {
              retryCount++;
              this.logger.warn(`Retrying sendMail... Attempt #${retryCount} due to: ${err.message}`);
            },
          }),
          retry({ count: this.options?.retryAttempts ?? 1, delay: 2000 }), // 失败时重试
          catchError((error: Error) => {
            this.logger.error(`Failed to send email after ${retryCount} retries: ${error.message}`);
            return throwError(() => error);
          }),
        );
      }),
    );
  }
}
