import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from '../../../common/decorators/api-response.decorator';
import { FindPermissionDto } from '../dto/find-permission.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from '../services/permission.service';

@ApiBearerAuth()
@ApiTags('权限管理')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiEndpoint({
    summary: '创建权限',
    response: {
      type: Permission,
      status: 201,
    },
  })
  @Post()
  createPermission(@Body() permissionData: Partial<Permission>) {
    return this.permissionService.createPermission(permissionData);
  }

  @ApiEndpoint({
    summary: '获取所有权限',
    response: {
      status: 200,
      description: '权限列表',
      type: Permission,
      isArray: true,
    },
  })
  @Get()
  findAllPermissions(@Query() findPermissionDto: FindPermissionDto) {
    return this.permissionService.findAllPermissions(findPermissionDto);
  }

  @ApiEndpoint({
    summary: '根据ID获取权限',
    params: [{ name: 'id', description: '权限ID' }],
    response: {
      type: Permission,
    },
  })
  @Get(':id')
  findPermissionById(@Param('id') id: string) {
    return this.permissionService.findPermissionById(id);
  }

  @ApiEndpoint({
    summary: '更新权限',
    params: [{ name: 'id', description: '权限ID' }],
    response: {
      type: Permission,
    },
  })
  @Put(':id')
  updatePermission(@Param('id') id: string, @Body() permissionData: Permission) {
    return this.permissionService.updatePermission(id, permissionData);
  }

  @ApiEndpoint({
    summary: '删除权限',
    params: [{ name: 'id', description: '权限ID' }],
    response: {
      type: Object,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '权限删除成功' },
        },
      },
    },
  })
  @Delete(':id')
  deletePermission(@Param('id') id: string) {
    return this.permissionService.deletePermission(id);
  }

  // // 用户权限管理
  // @ApiEndpoint({
  //   summary: '获取用户权限',
  //   params: [{ name: 'userId', description: '用户ID' }],
  //   response: {
  //     type: Permission,
  //     isArray: true,
  //   },
  // })
  // @Get('users/:userId/permissions')
  // getUserPermissions(@Param('userId') userId: string) {
  //   return this.permissionService.getUserPermissions(userId);
  // }

  // // 权限检查
  // @ApiEndpoint({
  //   summary: '检查用户是否有指定权限',
  //   params: [
  //     { name: 'userId', description: '用户ID' },
  //     { name: 'permissionName', description: '权限名称' },
  //   ],
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         hasPermission: { type: 'boolean', example: true },
  //       },
  //     },
  //   },
  // })
  // @Get('users/:userId/permissions/:permissionName/check')
  // checkUserPermission(@Param('userId') userId: string, @Param('permissionName') permissionName: string) {
  //   return this.permissionService.hasPermission(userId, permissionName);
  // }

  // @ApiEndpoint({
  //   summary: '检查用户是否有多个权限',
  //   params: [{ name: 'userId', description: '用户ID' }],
  //   queries: [{ name: 'permissions', description: '权限名称列表（逗号分隔）' }],
  //   response: {
  //     type: Object,
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         hasAllPermissions: { type: 'boolean', example: true },
  //       },
  //     },
  //   },
  // })
  // @Get('users/:userId/permissions/check')
  // checkUserMultiplePermissions(@Param('userId') userId: string, @Query('permissions') permissions: string) {
  //   const permissionList = permissions.split(',').map((p) => p.trim());
  //   return this.permissionService.checkUserPermissions(userId, permissionList);
  // }

  // // 按资源类型获取权限
  // @ApiEndpoint({
  //   summary: '根据资源类型获取权限',
  //   params: [{ name: 'resource', description: '资源类型' }],
  //   response: {
  //     type: Permission,
  //     isArray: true,
  //   },
  // })
  // @Get('resource/:resource')
  // getPermissionsByResource(@Param('resource') resource: ResourceType) {
  //   return this.permissionService.getPermissionsByResource(resource);
  // }

  // // 按权限类型获取权限
  // @ApiEndpoint({
  //   summary: '根据权限类型获取权限',
  //   params: [{ name: 'type', description: '权限类型' }],
  //   response: {
  //     type: Permission,
  //     isArray: true,
  //   },
  // })
  // @Get('type/:type')
  // getPermissionsByType(@Param('type') type: PermissionType) {
  //   return this.permissionService.getPermissionsByType(type);
  // }
}
