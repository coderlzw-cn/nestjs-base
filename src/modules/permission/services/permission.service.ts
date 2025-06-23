import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../role/entities/user-role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  // 创建权限
  async createPermission(permissionData: Partial<Permission>): Promise<Permission> {
    const permission = this.permissionRepository.create(permissionData);
    return await this.permissionRepository.save(permission);
  }

  // 获取所有权限
  async findAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  // 根据ID获取权限
  async findPermissionById(id: string): Promise<Permission | null> {
    return await this.permissionRepository.findOne({
      where: { id },
    });
  }

  // 更新权限
  async updatePermission(id: string, permissionData: Partial<Permission>): Promise<Permission | null> {
    await this.permissionRepository.update(id, permissionData);
    return await this.findPermissionById(id);
  }

  // 删除权限
  async deletePermission(id: string): Promise<void> {
    await this.permissionRepository.update(id, { isActive: false });
  }

  // // 用户权限管理
  // async getUserPermissions(userId: string): Promise<Permission[]> {
  //   const userRoles = await this.userRoleRepository.find({
  //     where: { userId },
  //     relations: ['role.permissions.permission'],
  //   });

  //   const permissions = new Set<Permission>();
  //   for (const userRole of userRoles) {
  //     if (userRole.role?.permissions) {
  //       for (const rolePermission of userRole.role.permissions) {
  //         if (rolePermission.permission) {
  //           permissions.add(rolePermission.permission);
  //         }
  //       }
  //     }
  //   }

  //   return Array.from(permissions);
  // }

  // async hasPermission(userId: string, permissionName: string): Promise<boolean> {
  //   const permissions = await this.getUserPermissions(userId);
  //   return permissions.some((p) => p.name === permissionName && p.isActive);
  // }

  // // 权限检查
  // async checkUserPermissions(userId: string, requiredPermissions: string[]): Promise<boolean> {
  //   const userPermissions = await this.getUserPermissions(userId);
  //   const userPermissionNames = userPermissions.map((p) => p.name);

  //   return requiredPermissions.every((permission) => userPermissionNames.includes(permission));
  // }

  // // 根据资源类型获取权限
  // async getPermissionsByResource(resource: ResourceType): Promise<Permission[]> {
  //   return await this.permissionRepository.find({
  //     where: { resource, isActive: true },
  //     order: { type: 'ASC', action: 'ASC' },
  //   });
  // }

  // // 根据权限类型获取权限
  // async getPermissionsByType(type: PermissionType): Promise<Permission[]> {
  //   return await this.permissionRepository.find({
  //     where: { type, isActive: true },
  //     order: { resource: 'ASC', action: 'ASC' },
  //   });
  // }

  // /**
  //  * 获取权限及其关联的角色信息
  //  */
  // async findPermissionWithRoles(permissionId: string): Promise<Permission | null> {
  //   return await this.permissionRepository.findOne({
  //     where: { id: permissionId, isActive: true },
  //     relations: ['rolePermissions.role'],
  //   });
  // }

  // /**
  //  * 获取所有权限及其关联的角色信息
  //  */
  // async findAllPermissionsWithRoles(): Promise<Permission[]> {
  //   return await this.permissionRepository.find({
  //     where: { isActive: true },
  //     relations: ['rolePermissions.role'],
  //     order: { resource: 'ASC', action: 'ASC' },
  //   });
  // }
}
