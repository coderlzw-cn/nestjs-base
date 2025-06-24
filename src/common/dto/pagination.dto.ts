import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '当前页码', example: 1 })
  @IsPositive({ message: '页码必须大于0' })
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @ApiProperty({ description: '每页条数', example: 10 })
  @IsPositive({ message: '每页条数必须大于0' })
  @Transform(({ value }) => Number(value))
  pageSize: number = 10;
}
