# API 装饰器使用指南

## 概述

完善的 API 装饰器将多个 Swagger 装饰器结合在一起，提供统一的 API 文档配置接口。

## 主要装饰器

### 1. ApiDecorator - 完整的 API 装饰器

这是最强大的装饰器，将以下 Swagger 装饰器结合在一起：
- `@ApiOperation` - 操作描述
- `@ApiParam` - 路径参数
- `@ApiQuery` - 查询参数
- `@ApiHeader` - 请求头
- `@ApiBody` - 请求体
- `@ApiResponse` - 响应

#### 基本用法

```typescript
@ApiDecorator({
  summary: '获取用户信息',
  description: '根据用户ID获取用户详细信息',
  tags: ['用户管理'],
  params: [
    { name: 'id', description: '用户ID', type: 'number', example: 1 }
  ],
  response: User,
  status: 200,
  responseDescription: '获取用户成功'
})
@Get(':id')
findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

#### 完整配置示例

```typescript
@ApiDecorator({
  summary: '获取用户列表',
  description: '分页获取用户列表，支持搜索和排序',
  tags: ['用户管理'],
  params: [
    { name: 'category', description: '用户分类', type: 'string', example: 'vip' }
  ],
  queries: [
    { name: 'page', description: '页码', type: 'number', example: 1, required: false },
    { name: 'limit', description: '每页数量', type: 'number', example: 10, required: false },
    { name: 'search', description: '搜索关键词', type: 'string', example: 'john', required: false },
    { 
      name: 'sort', 
      description: '排序字段', 
      type: 'string', 
      example: 'createdAt', 
      required: false, 
      enum: ['createdAt', 'updatedAt', 'name'] 
    },
  ],
  headers: [
    { name: 'Authorization', description: '认证令牌', example: 'Bearer token', required: true },
  ],
  body: CreateUserDto,
  response: User,
  status: 200,
  responseDescription: '获取用户列表成功',
})
@Get()
findAll(@Query() query: any) {
  return this.userService.findAll(query);
}
```

### 2. ApiResponseWrapper - 简化的响应装饰器

用于简单的 API 响应配置：

```typescript
@ApiResponseWrapper(User, 200, '获取用户成功')
@Get(':id')
findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

### 3. ApiPaginatedResponse - 分页响应装饰器

专门用于分页接口的响应配置：

```typescript
@ApiPaginatedResponse(User, 200, '获取用户列表成功')
@Get()
findAll(@Query() query: any) {
  return this.userService.findAll(query);
}
```

## 配置选项详解

### ApiParamConfig - 路径参数配置

```typescript
interface ApiParamConfig {
  name: string;           // 参数名
  description?: string;   // 参数描述
  required?: boolean;     // 是否必需（默认 true）
  type?: string;         // 参数类型
  example?: any;         // 示例值
}
```

### ApiQueryConfig - 查询参数配置

```typescript
interface ApiQueryConfig {
  name: string;           // 参数名
  description?: string;   // 参数描述
  required?: boolean;     // 是否必需（默认 false）
  type?: string;         // 参数类型
  example?: any;         // 示例值
  enum?: any[];          // 枚举值
}
```

### ApiHeaderConfig - 请求头配置

```typescript
interface ApiHeaderConfig {
  name: string;           // 请求头名
  description?: string;   // 请求头描述
  required?: boolean;     // 是否必需（默认 false）
  example?: string;       // 示例值
}
```

### ApiDecoratorConfig - 完整配置

```typescript
interface ApiDecoratorConfig<TModel = any> {
  summary: string;                    // 接口摘要
  description?: string;               // 接口详细描述
  tags?: string[];                    // 标签分组
  params?: ApiParamConfig[];          // 路径参数
  queries?: ApiQueryConfig[];         // 查询参数
  headers?: ApiHeaderConfig[];        // 请求头
  body?: Type<TModel>;               // 请求体类型
  response?: Type<TModel>;           // 响应类型
  status?: number;                    // 响应状态码
  responseDescription?: string;       // 响应描述
  deprecated?: boolean;               // 是否已废弃
}
```

## 使用场景示例

### 1. GET 请求 - 获取资源

```typescript
@ApiDecorator({
  summary: '获取用户详情',
  description: '根据用户ID获取用户详细信息',
  tags: ['用户管理'],
  params: [
    { name: 'id', description: '用户ID', type: 'number', example: 1 }
  ],
  response: User,
  status: 200,
  responseDescription: '获取用户详情成功'
})
@Get(':id')
findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

### 2. POST 请求 - 创建资源

```typescript
@ApiDecorator({
  summary: '创建用户',
  description: '创建新用户',
  tags: ['用户管理'],
  body: CreateUserDto,
  response: User,
  status: 201,
  responseDescription: '用户创建成功'
})
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### 3. PUT 请求 - 更新资源

```typescript
@ApiDecorator({
  summary: '更新用户',
  description: '根据用户ID更新用户信息',
  tags: ['用户管理'],
  params: [
    { name: 'id', description: '用户ID', type: 'number', example: 1 }
  ],
  body: UpdateUserDto,
  response: User,
  status: 200,
  responseDescription: '用户更新成功'
})
@Put(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.userService.update(+id, updateUserDto);
}
```

### 4. DELETE 请求 - 删除资源

```typescript
@ApiDecorator({
  summary: '删除用户',
  description: '根据用户ID删除用户',
  tags: ['用户管理'],
  params: [
    { name: 'id', description: '用户ID', type: 'number', example: 1 }
  ],
  status: 204,
  responseDescription: '用户删除成功'
})
@Delete(':id')
remove(@Param('id') id: string) {
  return this.userService.remove(+id);
}
```

### 5. 复杂查询接口

```typescript
@ApiDecorator({
  summary: '搜索用户',
  description: '根据多个条件搜索用户',
  tags: ['用户管理'],
  queries: [
    { name: 'keyword', description: '搜索关键词', type: 'string', example: 'john', required: false },
    { name: 'status', description: '用户状态', type: 'string', enum: ['active', 'inactive'], example: 'active', required: false },
    { name: 'role', description: '用户角色', type: 'string', enum: ['admin', 'user'], example: 'user', required: false },
    { name: 'page', description: '页码', type: 'number', example: 1, required: false },
    { name: 'limit', description: '每页数量', type: 'number', example: 10, required: false },
  ],
  response: User,
  status: 200,
  responseDescription: '搜索用户成功'
})
@Get('search')
searchUsers(@Query() query: any) {
  return this.userService.searchUsers(query);
}
```

### 6. 需要认证的接口

```typescript
@ApiDecorator({
  summary: '获取用户个人信息',
  description: '获取当前登录用户的个人信息',
  tags: ['用户管理', '个人信息'],
  headers: [
    { name: 'Authorization', description: '认证令牌', example: 'Bearer token', required: true },
  ],
  response: User,
  status: 200,
  responseDescription: '获取个人信息成功'
})
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## 自动生成的错误响应

`ApiDecorator` 会自动为每个接口添加以下错误响应：

- **400 Bad Request** - 请求参数错误
- **401 Unauthorized** - 未授权
- **404 Not Found** - 资源不存在
- **500 Internal Server Error** - 服务器内部错误

## 最佳实践

1. **使用有意义的摘要**: 提供清晰、简洁的接口描述
2. **合理分组**: 使用 tags 对接口进行分组
3. **提供示例**: 为参数和响应提供有意义的示例值
4. **类型安全**: 使用 DTO 类定义请求体和响应类型
5. **枚举值**: 对于有限选项的参数，使用 enum 属性
6. **必需性标记**: 正确标记参数的必需性
7. **状态码**: 使用合适的 HTTP 状态码

## 优势

1. **统一配置**: 一个装饰器配置多个 Swagger 装饰器
2. **类型安全**: 完整的 TypeScript 类型支持
3. **自动错误响应**: 自动添加常见的错误响应
4. **向后兼容**: 保留原有的简化装饰器
5. **易于维护**: 集中管理 API 文档配置
6. **减少重复**: 避免重复编写多个装饰器 