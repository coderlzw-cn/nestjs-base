import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FindUserDto extends PaginationDto {
  @ApiProperty({ description: '用户名', example: 'admin', required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
