import { User } from '../modules/user/entities/user.entity';

declare module 'express' {
  interface Request {
    user: User;
  }
}
