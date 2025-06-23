import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { catchError, from, map, of } from 'rxjs';
import { jwtRefreshConfiguration } from 'src/config/jwt.config';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(username);

    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  signIn(user: User) {
    console.log(user);

    return of(user).pipe(
      map((user) => {
        const plainUser = instanceToPlain(user);
        const accessToken = this.jwtService.sign(plainUser);
        const refreshToken = this.jwtService.sign(plainUser, {
          secret: jwtRefreshConfiguration().secret,
          expiresIn: jwtRefreshConfiguration().expiresIn,
        });
        return {
          accessToken,
          refreshToken,
        };
      }),
      catchError((error) => {
        this.logger.error('登录失败', error);

        throw new InternalServerErrorException('登录失败');
      }),
    );
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    const user = this.jwtService.verify<User>(refreshTokenDto.refreshToken, { secret: jwtRefreshConfiguration().secret });
    if (!user) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
    return of(user).pipe(
      map((user) => {
        const accessToken = this.jwtService.sign(user);
        const refreshToken = this.jwtService.sign(user, {
          secret: jwtRefreshConfiguration().secret,
          expiresIn: jwtRefreshConfiguration().expiresIn,
        });
        return {
          accessToken,
          refreshToken,
        };
      }),
    );
  }

  signUp(signUpDto: SignUpDto) {
    const user = this.userService.register(signUpDto);
    return of(user).pipe(
      map(() => of()),
      catchError((error) => {
        this.logger.error('注册失败', error);
        throw new InternalServerErrorException('注册失败');
      }),
    );
  }

  findAuthUser(user: User) {
    const userid = user.id;
    const promise = this.userService.findOne(userid);
    return from(promise).pipe(
      map((user) => {
        return user;
      }),
      catchError((error) => {
        this.logger.error('获取用户信息失败', error);
        throw new InternalServerErrorException('获取用户信息失败');
      }),
    );
  }
}
