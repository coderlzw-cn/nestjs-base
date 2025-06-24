import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants/enum.constants';

export const ROLES_OR_PERMISSIONS_KEY = 'roles_or_permissions';

export interface RolesOrPermissionsConfig {
  roles?: RoleType[];
  permissions?: string[];
}

export const RequireRolesOrPermissions = (roles?: RoleType[], permissions?: string[]) => SetMetadata(ROLES_OR_PERMISSIONS_KEY, { roles, permissions });
