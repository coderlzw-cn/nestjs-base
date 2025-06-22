import { ApiProperty } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '邮箱' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '密码', writeOnly: true })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ description: '昵称', required: false })
  @Column({ nullable: true })
  nickname?: string;

  @ApiProperty({ description: '是否激活' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;

  // 插入和更新前
  @BeforeInsert()
  public async hashPasswordInsert() {
    console.log('插入操作', this.password);
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
