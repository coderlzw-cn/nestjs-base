import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindPermissionDto extends PaginationDto {
  @ApiProperty({ description: '权限名称', example: 'user:list', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
