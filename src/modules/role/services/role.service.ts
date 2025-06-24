import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  // 角色管理
  async createRole(roleData: Partial<Role>) {
    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  // 获取所有角色
  async findAllRoles() {
    const roles = await this.roleRepository.find({
      where: { isActive: true },
      relations: ['rolePermissions.permission'],
    });
    return roles.map((role) => {
      const { rolePermissions, ...roleData } = role;
      return {
        ...roleData,
        permissions: rolePermissions.map((rp) => rp.permission),
      };
    });
  }

  async findRoleById(id: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { id, isActive: true },
      relations: ['rolePermissions.permission'],
    });
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role | null> {
    await this.roleRepository.update(id, roleData);
    return await this.findRoleById(id);
  }

  async deleteRole(id: string): Promise<void> {
    await this.roleRepository.update(id, { isActive: false });
  }

  // 用户角色管理
  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    return userRoles.map((ur) => ur.role).filter(Boolean);
  }

  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((r) => r.name === roleName && r.isActive);
  }

  // async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
  //   // 检查是否已经分配
  //   const existing = await this.userRoleRepository.findOne({
  //     where: { userId, roleId },
  //   });

  //   if (existing) {
  //     return existing;
  //   }

  //   const userRole = this.userRoleRepository.create({ userId, roleId });
  //   return await this.userRoleRepository.save(userRole);
  // }

  // async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
  //   await this.userRoleRepository.delete({ userId, roleId });
  // }

  // // 角色权限管理
  // async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
  //   // 检查是否已经分配
  //   const existing = await this.rolePermissionRepository.findOne({
  //     where: { roleId, permissionId },
  //   });

  //   if (existing) {
  //     return existing;
  //   }

  //   const rolePermission = this.rolePermissionRepository.create({ roleId, permissionId });
  //   return await this.rolePermissionRepository.save(rolePermission);
  // }

  // async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
  //   await this.rolePermissionRepository.delete({ roleId, permissionId });
  // }

  // async getRolePermissions(roleId: string): Promise<any[]> {
  //   const rolePermissions = await this.rolePermissionRepository.find({
  //     where: { roleId },
  //     relations: ['permission'],
  //   });
  //   return rolePermissions.map((rp) => rp.permission).filter(Boolean);
  // }

  // /**
  //  * 获取角色及其权限信息
  //  */
  // async findRoleWithPermissions(roleId: string): Promise<Role | null> {
  //   return await this.roleRepository.findOne({
  //     where: { id: roleId, isActive: true },
  //     relations: ['permissions.permission'],
  //   });
  // }

  // /**
  //  * 获取所有角色及其权限信息
  //  */
  // async findAllRolesWithPermissions() {
  //   return await this.roleRepository.find({
  //     where: { isActive: true },
  //     relations: ['permissions.permission'],
  //     order: { level: 'ASC', createdAt: 'ASC' },
  //   });
  // }
}
