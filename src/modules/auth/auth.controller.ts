import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from '../../common/guard/local.auth.guard';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiEndpoint } from '../../common/decorators/api-response.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('认证')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiParam({
  //   name: 'signInDto',
  //   type: SignInDto,
  //   required: true,
  //   description: '登录参数',
  //   example: {
  //     username: 'admin',
  //   },
  // })
  // @ApiTags
  @ApiEndpoint({
    summary: '登录',
    body: {
      type: SignInDto,
    },
    response: {
      status: 200,
      description: '登录成功',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('sign-in')
  signIn(@Req() req: Request, @CurrentUser() user: User) {
    return this.authService.signIn(user);
  }

  @ApiEndpoint({
    summary: '刷新令牌',
    response: {
      type: Object,
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
        example: {
          accessToken: '1234567890',
          refreshToken: '1234567890',
        },
      },
    },
  })
  @Public()
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiEndpoint({
    summary: '注册',
  })
  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiEndpoint({
    summary: '获取用户信息',
    response: {
      type: User,
    },
  })
  @Get('user')
  findAuthUser(@CurrentUser() user: User) {
    return this.authService.findAuthUser(user);
  }
}
