import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_OR_PERMISSIONS_KEY, RolesOrPermissionsConfig } from '../decorators/roles-or-permissions.decorator';
import { PermissionService } from '../../modules/permission/services/permission.service';
import { RoleService } from '../../modules/role/services/role.service';

@Injectable()
export class RolesOrPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.reflector.getAllAndOverride<RolesOrPermissionsConfig>(ROLES_OR_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!config || (!config.roles && !config.permissions)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // 检查角色权限
    if (config.roles && config.roles.length > 0) {
      const userRoles = await this.roleService.getUserRoles(user.id);
      const userRoleTypes = userRoles.map((role) => role.type);
      const hasRequiredRole = config.roles.some((role) => userRoleTypes.includes(role));

      if (hasRequiredRole) {
        return true;
      }
    }

    // 检查具体权限
    if (config.permissions && config.permissions.length > 0) {
      for (const permission of config.permissions) {
        const hasPermission = await this.permissionService.hasPermission(user.id, permission);
        if (hasPermission) {
          return true;
        }
      }
    }

    return false;
  }
}
