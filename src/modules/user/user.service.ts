import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { PermissionService } from '../permission/services/permission.service';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly permissionService: PermissionService,
  ) {}

  /**
   * 注册用户
   * @param signUpDto
   * @returns
   */
  register(signUpDto: SignUpDto) {
    const user = new User(signUpDto);
    const userEntity = this.userRepository.create(user);
    return this.userRepository.save(userEntity);
  }

  async findAll(findUserDto: FindUserDto, user: User) {
    const { page, pageSize } = findUserDto;
    const condition = {
      where: {
        id: Not(user.id),
        username: findUserDto.username ? Like(`%${findUserDto.username}%`) : undefined,
      },
    };
    const [users, total] = await this.userRepository.findAndCount({
      ...condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['roles.role'],
    });
    return TransformInterceptor.pagination(users, page, pageSize, total);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roles.role'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByUsernameOrEmail(value: string) {
    return this.userRepository.findOne({
      where: [{ username: value }, { email: value }],
    });
  }

  /**
   * 获取用户及其角色信息
   */
  async findUserWithRoles(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles.role'],
    });
  }

  /**
   * 获取用户及其角色和权限信息
   */
  async findUserWithRolesAndPermissions(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles.role', 'userRoles.role.rolePermissions.permission'],
    });
  }
}
