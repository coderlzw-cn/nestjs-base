import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolePermission } from '../../role/entities/role-permission.entity';
import { PermissionType, ResourceType } from '../../../common/constants/enum.constants';

@Entity('permissions')
export class Permission {
  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: '权限ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '权限名称',
    example: 'user:read',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: '权限显示名称',
    example: '查看用户',
  })
  @Column()
  displayName: string;

  @ApiProperty({
    description: '权限描述',
    example: '允许查看用户信息',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.READ,
  })
  @Column({ type: 'enum', enum: PermissionType })
  type: PermissionType;

  @ApiProperty({
    description: '资源类型',
    enum: ResourceType,
    example: ResourceType.USER,
  })
  @Column({ type: 'enum', enum: ResourceType })
  resource: ResourceType;

  @ApiProperty({
    description: '资源标识',
    example: 'users',
  })
  @Column()
  resourceId: string;

  @ApiProperty({
    description: '权限动作',
    example: 'read',
  })
  @Column()
  action: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // ==================== 关联关系 ====================

  /**
   * 权限角色关联 - 一对多关系
   * 一个权限可以有多个权限角色关联
   * 通过 RolePermission 中间表实现权限和角色的多对多关系
   */
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];
}
