import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthProvider } from '../../../common/constants/enum.constants';

@Entity('auth_providers')
export class AuthProviders {
  @ApiProperty({
    description: '认证提供商ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  @Column({ name: 'user_id', nullable: true, comment: '用户ID' })
  userId: number;

  @ApiProperty({
    description: '提供商',
    enum: AuthProvider,
    example: AuthProvider.GOOGLE,
  })
  @Column({ nullable: true, comment: '提供商', type: 'enum', enum: AuthProvider })
  provider: AuthProvider;

  @ApiProperty({
    description: '提供商ID',
    example: 'google_123456',
  })
  @Column({ nullable: true, comment: '提供商ID' })
  providerId: string;

  @ApiProperty({
    description: '访问令牌',
    example: 'ya29.a0AfH6SMC...',
  })
  @Column({ nullable: true, comment: '访问令牌' })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: '1//04dX...',
  })
  @Column({ nullable: true, comment: '刷新令牌' })
  refreshToken: string;

  @ApiProperty({
    description: '过期时间',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Column({ nullable: true, comment: '过期时间' })
  expiresAt: Date;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ nullable: true, comment: '创建时间' })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ nullable: true, comment: '更新时间' })
  updatedAt: Date;
}
