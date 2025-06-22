import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { to } from 'await-to-js';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      // passReqToCallback: true,
    });
  }

  async validate(username: string, password: string) {
    const [error, user] = await to(this.authService.validateUser(username, password));
    if (error || !user) {
      throw new BadRequestException('用户名或密码错误');
    }
    return user;
  }
}
