export type engineOptions = Record<string, any>;

export interface MailModuleOptions {
  credentials: {
    host: string;
    port: number;
    secure: boolean;
    password: string;
    username: string;
  };
  retryAttempts?: number; // 重试次数
  retryDelay?: number; // 重试延迟
  templateDir: string;
}
