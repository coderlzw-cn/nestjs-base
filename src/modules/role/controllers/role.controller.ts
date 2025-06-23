import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from '../../../common/decorators/api-response.decorator';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';

@ApiBearerAuth()
@ApiTags('角色管理')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiEndpoint({
    summary: '创建角色',
    response: {
      type: Role,
      status: 201,
    },
  })
  @Post()
  createRole(@Body() roleData: Partial<Role>) {
    return this.roleService.createRole(roleData);
  }

  @ApiEndpoint({
    summary: '获取所有角色',
    response: {
      type: Role,
      isArray: true,
    },
  })
  @Get()
  findAllRoles() {
    return this.roleService.findAllRoles();
  }

  @ApiEndpoint({
    summary: '根据ID获取角色',
    params: [{ name: 'id', description: '角色ID' }],
    response: {
      type: Role,
    },
  })
  @Get(':id')
  findRoleById(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }

  @ApiEndpoint({
    summary: '更新角色',
    params: [{ name: 'id', description: '角色ID' }],
    response: {
      type: Role,
    },
  })
  @Put(':id')
  updateRole(@Param('id') id: string, @Body() roleData: Partial<Role>) {
    return this.roleService.updateRole(id, roleData);
  }

  @ApiEndpoint({
    summary: '删除角色',
    params: [{ name: 'id', description: '角色ID' }],
    response: {
      type: Object,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '角色删除成功' },
        },
      },
    },
  })
  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  // // 用户角色管理
  // @ApiEndpoint({
  //   summary: '为用户分配角色',
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         message: { type: 'string', example: '角色分配成功' },
  //       },
  //     },
  //   },
  // })
  // @Post('users/:userId/roles/:roleId')
  // assignRoleToUser(@Param('userId') userId: string, @Param('roleId') roleId: string) {
  //   return this.roleService.assignRoleToUser(userId, roleId);
  // }

  // @ApiEndpoint({
  //   summary: '移除用户角色',
  //   params: [
  //     { name: 'userId', description: '用户ID' },
  //     { name: 'roleId', description: '角色ID' },
  //   ],
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         message: { type: 'string', example: '角色移除成功' },
  //       },
  //     },
  //   },
  // })
  // @Delete('users/:userId/roles/:roleId')
  // removeRoleFromUser(@Param('userId') userId: string, @Param('roleId') roleId: string) {
  //   return this.roleService.removeRoleFromUser(userId, roleId);
  // }

  // @ApiEndpoint({
  //   summary: '获取用户角色',
  //   params: [{ name: 'userId', description: '用户ID' }],
  //   response: {
  //     type: Role,
  //     isArray: true,
  //   },
  // })
  // @Get('users/:userId/roles')
  // getUserRoles(@Param('userId') userId: string) {
  //   return this.roleService.getUserRoles(userId);
  // }

  // // 角色权限管理
  // @ApiEndpoint({
  //   summary: '为角色分配权限',
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         message: { type: 'string', example: '权限分配成功' },
  //       },
  //     },
  //   },
  // })
  // @Post(':roleId/permissions/:permissionId')
  // assignPermissionToRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
  //   return this.roleService.assignPermissionToRole(roleId, permissionId);
  // }

  // @ApiEndpoint({
  //   summary: '移除角色权限',
  //   params: [
  //     { name: 'roleId', description: '角色ID' },
  //     { name: 'permissionId', description: '权限ID' },
  //   ],
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         message: { type: 'string', example: '权限移除成功' },
  //       },
  //     },
  //   },
  // })
  // @Delete(':roleId/permissions/:permissionId')
  // removePermissionFromRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
  //   return this.roleService.removePermissionFromRole(roleId, permissionId);
  // }

  // @ApiEndpoint({
  //   summary: '获取角色权限',
  //   params: [{ name: 'roleId', description: '角色ID' }],
  //   response: {
  //     type: Object,
  //     isArray: true,
  //   },
  // })
  // @Get(':roleId/permissions')
  // getRolePermissions(@Param('roleId') roleId: string) {
  //   return this.roleService.getRolePermissions(roleId);
  // }

  // // 角色检查
  // @ApiEndpoint({
  //   summary: '检查用户是否有指定角色',
  //   params: [
  //     { name: 'userId', description: '用户ID' },
  //     { name: 'roleName', description: '角色名称' },
  //   ],
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         hasRole: { type: 'boolean', example: true },
  //       },
  //     },
  //   },
  // })
  // @Get('users/:userId/roles/:roleName/check')
  // checkUserRole(@Param('userId') userId: string, @Param('roleName') roleName: string) {
  //   return this.roleService.hasRole(userId, roleName);
  // }
}
