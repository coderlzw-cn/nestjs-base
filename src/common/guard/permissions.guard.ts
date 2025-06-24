import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionService } from '../../modules/permission/services/permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    console.log(user);

    if (!user) {
      return false;
    }

    // 检查用户是否具有所需权限
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permissionService.hasPermission(user.id, permission);
      if (!hasPermission) {
        return false;
      }
    }

    return true;
  }
}
