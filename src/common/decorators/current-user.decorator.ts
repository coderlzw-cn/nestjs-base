import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../modules/user/entities/user.entity';

/**
 * 当前用户装饰器
 * @param data 数据
 * @param ctx 执行上下文
 * @returns 当前用户
 * @example
 * @CurrentUser()
 * @CurrentUser('user.id')
 */
export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user;
  return data ? user?.[data] : user;
});
