# 分层权限系统使用指南

## 概述

为了解决管理员接口需要配置大量细粒度权限的问题，我们实现了一个**分层权限系统**，提供三种权限控制方案：

1. **角色级别控制** - 适用于管理员等高级权限
2. **权限级别控制** - 适用于细粒度权限控制
3. **混合控制** - 同时支持角色和权限检查

## 权限控制方案

### 1. 角色级别控制 (@RequireRoles)

适用于管理员等高级权限，只需要检查用户角色，无需配置大量细粒度权限。

```typescript
import { RequireRoles } from 'src/common/decorators/roles.decorator';
import { RoleType } from 'src/modules/role/entities/role.entity';

@Controller('users')
export class UserController {
  // 管理员级别的权限控制 - 只需要角色
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Delete('admin/:id')
  async deleteUserAsAdmin(@Param('id') id: string) {
    // 管理员删除用户逻辑
  }
}
```

**优点：**
- 简单易用，只需要一个装饰器
- 适合管理员等高级权限控制
- 无需配置大量细粒度权限

### 2. 权限级别控制 (@RequirePermissions)

适用于细粒度权限控制，需要用户具有具体的权限。

```typescript
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';

@Controller('users')
export class UserController {
  // 细粒度权限控制 - 需要具体权限
  @RequirePermissions('user:delete')
  @Delete('permission/:id')
  async deleteUserWithPermission(@Param('id') id: string) {
    // 有删除权限的用户删除用户逻辑
  }
}
```

**优点：**
- 精确的权限控制
- 适合普通用户的细粒度权限管理
- 可以精确控制每个操作

### 3. 混合权限控制 (@RequireRolesOrPermissions)

同时支持角色和权限检查，满足任一条件即可访问。

```typescript
import { RequireRolesOrPermissions } from 'src/common/decorators/roles-or-permissions.decorator';
import { RoleType } from 'src/modules/role/entities/role.entity';

@Controller('users')
export class UserController {
  // 混合权限控制 - 管理员或有特定权限的用户都可以访问
  @RequireRolesOrPermissions([RoleType.ADMIN], ['user:delete'])
  @Delete('mixed/:id')
  async deleteUserMixed(@Param('id') id: string) {
    // 管理员或有删除权限的用户删除用户逻辑
  }
}
```

**优点：**
- 灵活的权限控制
- 既支持角色级别，也支持权限级别
- 满足复杂业务场景需求

## 使用建议

### 1. 管理员接口
对于管理员接口，建议使用角色级别控制：

```typescript
@RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
@Post('system/config')
async updateSystemConfig() {
  // 系统配置更新逻辑
}
```

### 2. 普通用户接口
对于普通用户接口，使用细粒度权限控制：

```typescript
@RequirePermissions('user:read')
@Get('profile')
async getUserProfile() {
  // 获取用户资料逻辑
}
```

### 3. 混合场景
对于需要灵活控制的场景，使用混合权限控制：

```typescript
@RequireRolesOrPermissions([RoleType.ADMIN], ['user:update'])
@Put('users/:id')
async updateUser(@Param('id') id: string) {
  // 管理员或有更新权限的用户都可以更新用户
}
```

## 权限命名规范

建议使用以下命名规范：

```
资源:操作
```

例如：
- `user:read` - 读取用户信息
- `user:create` - 创建用户
- `user:update` - 更新用户
- `user:delete` - 删除用户
- `role:assign` - 分配角色
- `permission:grant` - 授予权限

## 角色类型

系统预定义了以下角色类型：

- `SUPER_ADMIN` - 超级管理员
- `ADMIN` - 管理员
- `USER` - 普通用户
- `GUEST` - 访客

## 最佳实践

1. **管理员接口优先使用角色控制** - 避免配置大量细粒度权限
2. **普通用户接口使用权限控制** - 精确控制用户操作
3. **复杂场景使用混合控制** - 提供灵活的权限管理
4. **统一权限命名规范** - 便于管理和维护
5. **合理分配角色和权限** - 避免权限过度或不足

## 示例场景

### 场景1：系统管理接口
```typescript
// 只有管理员可以访问
@RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
@Post('system/backup')
async createSystemBackup() {
  // 系统备份逻辑
}
```

### 场景2：用户管理接口
```typescript
// 管理员或有用户管理权限的用户可以访问
@RequireRolesOrPermissions([RoleType.ADMIN], ['user:manage'])
@Get('users')
async getAllUsers() {
  // 获取所有用户逻辑
}
```

### 场景3：个人操作接口
```typescript
// 需要具体权限
@RequirePermissions('profile:update')
@Put('profile')
async updateProfile() {
  // 更新个人资料逻辑
}
```

这样的分层权限系统既解决了管理员接口权限配置繁琐的问题，又保持了细粒度权限控制的灵活性。 