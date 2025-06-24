import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from '../../common/decorators/api-response.decorator';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { PermissionsGuard } from '../../common/guard/permissions.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { RequireRoles } from '../../common/decorators/roles.decorator';
import { RequireRolesOrPermissions } from '../../common/decorators/roles-or-permissions.decorator';
import { RoleType } from '../../common/constants/enum.constants';

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiEndpoint({
    summary: '获取所有用户信息',
    response: {
      type: User,
    },
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:delete')
  @Get()
  findAll(@Query() findUserDto: FindUserDto, @CurrentUser() user: User) {
    return this.userService.findAll(findUserDto, user);
  }

  // 示例1: 管理员级别的权限控制 - 只需要角色
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Delete('admin/:id')
  @ApiOperation({ summary: '管理员删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  deleteUserAsAdmin(@Param('id') id: string) {
    // 这里应该调用实际的删除方法
    return { message: '管理员删除用户成功', userId: id };
  }

  // 示例2: 细粒度权限控制 - 需要具体权限
  @RequirePermissions('user:delete')
  @Delete('permission/:id')
  @ApiOperation({ summary: '有删除权限的用户删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  deleteUserWithPermission(@Param('id') id: string) {
    // 这里应该调用实际的删除方法
    return { message: '有权限用户删除用户成功', userId: id };
  }

  // 示例3: 混合权限控制 - 管理员或有特定权限的用户都可以访问
  @RequireRolesOrPermissions([RoleType.ADMIN], ['user:delete'])
  @Delete('mixed/:id')
  @ApiOperation({ summary: '管理员或有删除权限的用户删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  deleteUserMixed(@Param('id') id: string) {
    // 这里应该调用实际的删除方法
    return { message: '混合权限删除用户成功', userId: id };
  }
}
