import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity('roles')
export class Role {
  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '角色名称',
    example: 'admin',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: '角色显示名称',
    example: '管理员',
  })
  @Column()
  displayName: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员，拥有所有权限',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: '角色类型',
    enum: RoleType,
    example: RoleType.ADMIN,
  })
  @Column({ type: 'enum', enum: RoleType })
  type: RoleType;

  @ApiProperty({
    description: '角色级别',
    example: 1,
  })
  @Column({ default: 1 })
  level: number;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: '是否系统角色',
    example: false,
  })
  @Column({ default: false })
  isSystem: boolean;

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
   * 角色权限关联 - 一对多关系
   * 一个角色可以有多个角色权限关联
   * 通过 RolePermission 中间表实现角色和权限的多对多关系
   */
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
