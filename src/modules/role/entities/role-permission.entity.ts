import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

/**
 * 角色权限关联实体
 * 用于管理角色和权限之间的多对多关系
 * 包含额外的字段如 id、创建时间等
 */
@Entity('role_permissions')
export class RolePermission {
  constructor(partial: Partial<RolePermission>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: '关联ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ApiProperty({
    description: '权限ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId: string;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // ==================== 关联关系 ====================

  /**
   * 角色关联 - 多对一关系
   * 一个角色权限关联属于一个角色
   */
  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  /**
   * 权限关联 - 多对一关系
   * 一个角色权限关联属于一个权限
   */
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
