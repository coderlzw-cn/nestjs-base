# NestJS 项目结构说明

## 目录结构

```
src/
├── main.ts                         // 应用入口
├── app.module.ts                  // 根模块
├── app.controller.ts              // 应用控制器
├── app.service.ts                 // 应用服务
├── common/                        // 公共模块（拦截器、异常过滤器、常量、装饰器等）
│   ├── constants/                 // 全局常量
│   │   ├── boolean.constants.ts
│   │   └── string.constants.ts
│   ├── decorators/               // 自定义装饰器
│   │   ├── api-response.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── exceptions/               // 自定义异常类
│   │   └── custom.exception.ts
│   ├── filters/                  // 异常过滤器
│   │   ├── all-exception.filter.ts
│   │   └── http-exception.filter.ts
│   ├── guards/                   // 守卫
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/             // 拦截器
│   │   ├── cache.interceptor.ts
│   │   ├── errors.interceptor.ts
│   │   ├── retry.interceptor.ts
│   │   ├── timeout.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── middleware/               // 中间件
│   │   └── request-logger.middleware.ts
│   ├── pipes/                    // 自定义管道
│   │   └── validation.pipe.ts
│   └── utils/                    // 通用工具函数
│       └── response.util.ts
├── config/                        // 配置管理
│   ├── configuration.ts          // 配置项定义
│   └── validation.schema.ts      // Joi 校验 schema
├── modules/                       // 核心业务模块（按功能域划分）
│   ├── user/                     // 用户模块
│   │   ├── dto/                  // DTO 定义
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/             // Entity 定义
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts    // 控制器
│   │   ├── user.service.ts       // 业务逻辑
│   │   └── user.module.ts        // 模块定义
│   └── auth/                     // 鉴权模块
│       ├── dto/
│       │   └── login.dto.ts
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       └── auth.module.ts
├── shared/                        // 跨模块共享代码
│   └── database/                 // 数据库初始化模块
│       └── database.module.ts
├── interfaces/                    // 接口类型定义
│   └── user.interface.ts
├── jobs/                          // 定时任务模块
│   └── clean-cache.job.ts
├── schedule/                      // 使用 @nestjs/schedule 定时任务模块
└── uploads/                       // 文件上传存储
```

## 主要特性

### 1. 模块化架构
- **用户模块**: 完整的用户CRUD操作
- **认证模块**: JWT认证和登录功能
- **数据库模块**: TypeORM配置和连接管理

### 2. 配置管理
- 使用 `@nestjs/config` 进行配置管理
- Joi验证schema确保环境变量正确性
- 支持多环境配置（dev, prod, test）

### 3. 全局功能
- **拦截器**: 响应转换、错误处理、重试、超时、缓存
- **过滤器**: 全局异常处理
- **守卫**: JWT认证守卫
- **管道**: 自定义验证管道
- **中间件**: 请求日志记录

### 4. 开发工具
- **Swagger**: API文档自动生成
- **热重载**: 开发环境热更新
- **定时任务**: 使用 `@nestjs/schedule` 的定时任务

### 5. 数据库
- **TypeORM**: 对象关系映射
- **MySQL**: 数据库支持
- **实体**: 用户实体定义

## 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# 应用配置
NODE_ENV=dev
PORT=3000
HOST=0.0.0.0
API_PREFIX=api

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=nestjs_base

# JWT配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d
```

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发环境运行
pnpm run start:dev

# 生产环境构建
pnpm run build
pnpm run start:prod
```

## API文档

启动项目后访问：`http://localhost:3000/api` 查看Swagger API文档。 