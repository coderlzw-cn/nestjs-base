import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map } from 'rxjs';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { UserRole } from '../../role/entities/user-role.entity';
import { FindPermissionDto } from '../dto/find-permission.dto';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
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
  findAllPermissions(findPermissionDto: FindPermissionDto) {
    const { page, pageSize } = findPermissionDto;
    const promise = this.permissionRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      where: {
        name: findPermissionDto.name ? Like(`%${findPermissionDto.name}%`) : undefined,
      },
    });
    return from(promise).pipe(
      map(([permissions, total]) => ({
        data: permissions,
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      })),
      catchError((error) => {
        this.logger.error('获取权限列表失败', error);
        throw new InternalServerErrorException('获取权限列表失败');
      }),
    );
  }

  // 根据ID获取权限
  findPermissionById(id: string) {
    const promise = this.permissionRepository.findOne({
      where: { id },
    });

    return from(promise).pipe(
      map((permission) => permission),
      catchError((error) => {
        this.logger.error('获取权限失败', error);
        throw new InternalServerErrorException('获取权限失败');
      }),
    );
  }

  // 更新权限
  updatePermission(id: string, permissionData: Partial<Permission>) {
    this.logger.log(`更新权限: ${id}`, permissionData);
    const promise = this.permissionRepository.update(id, permissionData);
    return from(promise).pipe(
      map(() => this.findPermissionById(id)),
      catchError((error: Error) => {
        console.log(error.name, error.message);
        this.logger.error(`更新权限失败 ${error.message}`);
        throw new InternalServerErrorException('更新权限失败');
      }),
    );
  }

  // 删除权限
  deletePermission(id: string) {
    const promise = this.permissionRepository.update(id, { isActive: false });
    return from(promise).pipe(
      map(() => this.findPermissionById(id)),
      catchError((error: Error) => {
        this.logger.error(`删除权限失败 ${error.message}`);
        throw new InternalServerErrorException('删除权限失败');
      }),
    );
  }

  // 用户权限管理
  async getUserPermissions(userId: string) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role.rolePermissions.permission'],
    });

    const permissions = new Set<Permission>();
    for (const userRole of userRoles) {
      if (userRole.role?.rolePermissions) {
        for (const rolePermission of userRole.role.rolePermissions) {
          if (rolePermission.permission) {
            permissions.add(rolePermission.permission);
          }
        }
      }
    }

    return Array.from(permissions);
  }

  async hasPermission(userId: string, permissionName: string) {
    const permissions = await this.getUserPermissions(userId);
    console.log(permissions, 'permissions');

    return permissions.some((p) => p.name === permissionName && p.isActive);
  }

  // // 权限检查
  // async checkUserPermissions(userId: string, requiredPermissions: string[]){
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
  // async findPermissionWithRoles(permissionId: string) {
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
