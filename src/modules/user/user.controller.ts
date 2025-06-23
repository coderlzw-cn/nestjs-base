import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiEndpoint } from '../../common/decorators/api-response.decorator';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiEndpoint({
    summary: '获取所有用户信息',
    pagination: {
      enabled: true,
    },
    response: {
      type: User,
      isArray: true,
    },
  })
  @Get()
  findAll(@Query() findUserDto: FindUserDto, @CurrentUser() user: User) {
    return this.userService.findAll(findUserDto, user);
  }
}
