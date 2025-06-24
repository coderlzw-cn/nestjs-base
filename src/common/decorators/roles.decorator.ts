import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants/enum.constants';

export const ROLES_KEY = 'roles';

export const RequireRoles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
