import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiEndpoint as ApiSwaggerResponse } from 'src/common/decorators/api-response.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

class UserQuery {
  @ApiProperty({ description: '用户分类', example: 'vip' })
  category: string;

  @ApiProperty({ description: '页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  limit: number;

  @ApiProperty({ description: '搜索关键词', example: 'john' })
  search: string;
}

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  @ApiSwaggerResponse({
    summary: '获取用户列表',
  })
  test(@Req() req: Request) {
    console.log(req.user, '----');
    return {
      id: 1,
      username: 'test_user',
      email: 'test@example.com',
      nickname: '测试用户',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功', type: User })
  create() {
    return this.userService.create();
  }

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  @ApiResponse({ status: 200, description: '获取用户列表成功', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiResponse({ status: 200, description: '获取用户成功', type: User })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '更新用户成功', type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '删除用户成功' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
