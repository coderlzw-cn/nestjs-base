<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Base Project

一个基于 NestJS 的后端项目模板，集成了常用的功能和最佳实践。

## 主要特性

- 🚀 **NestJS 框架**: 基于最新的 NestJS 框架
- 🔐 **JWT 认证**: 完整的 JWT 认证系统
- 🗄️ **数据库集成**: TypeORM 与 MySQL 集成
- 📝 **API 文档**: Swagger/OpenAPI 文档自动生成
- 🌐 **国际化**: 多语言支持
- 🛡️ **安全**: 内置安全防护措施
- 📊 **缓存**: Redis 缓存支持
- ⏰ **定时任务**: 定时任务调度
- 🧪 **测试**: 完整的测试配置

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 环境配置

复制 `.env.example` 文件为 `.env` 并配置相关环境变量：

```bash
cp .env.example .env
```

### 运行项目

```bash
# 开发模式
pnpm run start:dev

# 生产模式
pnpm run start:prod
```

## API 文档

启动项目后，访问 `http://localhost:3000/api` 查看 Swagger API 文档。

## 项目结构

```
src/
├── common/           # 公共模块
│   ├── decorators/   # 自定义装饰器
│   ├── exceptions/   # 异常处理
│   ├── filters/      # 异常过滤器
│   ├── guards/       # 守卫
│   ├── interceptors/ # 拦截器
│   ├── middleware/   # 中间件
│   └── pipes/        # 管道
├── config/           # 配置文件
├── modules/          # 业务模块
│   ├── auth/         # 认证模块
│   └── user/         # 用户模块
├── shared/           # 共享模块
└── main.ts           # 应用入口
```

## ApiEndpoint 装饰器

项目提供了一个强大的 `ApiEndpoint` 装饰器，用于简化 Swagger 文档的生成。

### 基本用法

```typescript
import { ApiEndpoint } from 'src/common/decorators/api-response.decorator';
import { User } from './entities/user.entity';

@Get(':id')
@ApiEndpoint({
  summary: '获取用户信息',
  description: '根据用户ID获取用户详细信息',
  tags: ['用户管理'],
  params: [
    { name: 'id', description: '用户ID', type: 'number', example: 1 }
  ],
  response: { type: User, status: 200 }
})
findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

### 分页用法

```typescript
@Get()
@ApiEndpoint({
  summary: '获取用户列表',
  tags: ['用户管理'],
  pagination: { enabled: true },
  response: { type: User, isArray: true }
})
findAll(@Query() query: any) {
  return this.userService.findAll(query);
}
```

### 自定义 Schema

```typescript
@Get('stats')
@ApiEndpoint({
  summary: '获取用户统计',
  tags: ['用户管理'],
  response: {
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 100 },
        activeUsers: { type: 'number', example: 80 }
      }
    }
  }
})
getStats() {
  return this.userService.getStats();
}
```

### 简化装饰器

```typescript
// 简单装饰器
@ApiEndpointSimple('获取用户信息', User)

// 分页装饰器
@ApiEndpointPaginated('获取用户列表', User)
```

更多详细用法请参考 `src/common/decorators/api-response-usage.md`。

## 开发指南

### 添加新模块

1. 在 `src/modules/` 下创建新模块目录
2. 创建模块文件、控制器、服务等
3. 在 `app.module.ts` 中导入新模块

### 添加新的装饰器

1. 在 `src/common/decorators/` 下创建装饰器文件
2. 导出装饰器函数
3. 在需要的地方导入使用

### 数据库迁移

```bash
# 生成迁移文件
pnpm run migration:generate

# 运行迁移
pnpm run migration:run
```

## 测试

```bash
# 单元测试
pnpm run test

# E2E 测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t nestjs-base .

# 运行容器
docker run -p 3000:3000 nestjs-base
```

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 配置生产环境数据库
3. 配置 Redis 连接
4. 设置 JWT 密钥

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
