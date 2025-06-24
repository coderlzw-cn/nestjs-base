import { ApiProperty } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../../role/entities/user-role.entity';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: '邮箱',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: '密码',
    writeOnly: true,
    example: 'hashedPassword123',
  })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: '昵称',
    required: false,
    example: 'John Doe',
  })
  @Column({ nullable: true })
  nickname?: string;

  @ApiProperty({
    description: '是否激活',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  // 角色关联 - 通过 UserRole 中间表
  @ApiProperty({
    description: '用户角色关联',
    type: () => [UserRole],
    isArray: true,
  })
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];

  // 插入和更新前
  @BeforeInsert()
  public async hashPasswordInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  public async hashPasswordUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
