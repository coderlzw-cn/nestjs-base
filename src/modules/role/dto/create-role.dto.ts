import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { RoleType } from '../../../common/constants/enum.constants';

export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
    example: 'admin',
    maxLength: 50,
  })
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(50, { message: '角色名称长度不能超过50个字符' })
  name: string;

  @ApiProperty({
    description: '角色显示名称',
    example: '管理员',
    maxLength: 100,
  })
  @IsString({ message: '角色显示名称必须是字符串' })
  @IsNotEmpty({ message: '角色显示名称不能为空' })
  @MaxLength(100, { message: '角色显示名称长度不能超过100个字符' })
  displayName: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员，拥有所有权限',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: '角色描述必须是字符串' })
  @IsOptional()
  @MaxLength(500, { message: '角色描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({
    description: '角色类型',
    enum: RoleType,
    example: RoleType.ADMIN,
  })
  @IsEnum(RoleType, { message: '角色类型必须是有效的枚举值' })
  type: RoleType;

  @ApiProperty({
    description: '角色级别',
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: '角色级别必须是数字' })
  @Min(1, { message: '角色级别必须大于等于1' })
  level: number;
}
