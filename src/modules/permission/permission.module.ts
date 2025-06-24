import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../role/entities/user-role.entity';
import { PermissionController } from './controllers/permission.controller';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './services/permission.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Permission, UserRole])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
