import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfiguration } from 'src/config/jwt.config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConfiguration().secret,
      signOptions: {
        expiresIn: jwtConfiguration().expiresIn,
      },
    }),
  ],
})
export class NestJwtModule {}
