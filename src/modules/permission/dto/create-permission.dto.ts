import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PermissionType, ResourceType } from '../entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: 'user:read',
    maxLength: 100,
  })
  @IsString({ message: '权限名称必须是字符串' })
  @IsNotEmpty({ message: '权限名称不能为空' })
  @MaxLength(100, { message: '权限名称长度不能超过100个字符' })
  name: string;

  @ApiProperty({
    description: '权限显示名称',
    example: '查看用户',
    maxLength: 100,
  })
  @IsString({ message: '权限显示名称必须是字符串' })
  @IsNotEmpty({ message: '权限显示名称不能为空' })
  @MaxLength(100, { message: '权限显示名称长度不能超过100个字符' })
  displayName: string;

  @ApiProperty({
    description: '权限描述',
    example: '允许查看用户信息',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: '权限描述必须是字符串' })
  @IsOptional()
  @MaxLength(500, { message: '权限描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.READ,
  })
  @IsEnum(PermissionType, { message: '权限类型必须是有效的枚举值' })
  type: PermissionType;

  @ApiProperty({
    description: '资源类型',
    enum: ResourceType,
    example: ResourceType.USER,
  })
  @IsEnum(ResourceType, { message: '资源类型必须是有效的枚举值' })
  resource: ResourceType;

  @ApiProperty({
    description: '资源标识',
    example: 'users',
    maxLength: 100,
  })
  @IsString({ message: '资源标识必须是字符串' })
  @IsNotEmpty({ message: '资源标识不能为空' })
  @MaxLength(100, { message: '资源标识长度不能超过100个字符' })
  resourceId: string;

  @ApiProperty({
    description: '权限动作',
    example: 'read',
    maxLength: 50,
  })
  @IsString({ message: '权限动作必须是字符串' })
  @IsNotEmpty({ message: '权限动作不能为空' })
  @MaxLength(50, { message: '权限动作长度不能超过50个字符' })
  action: string;
}
