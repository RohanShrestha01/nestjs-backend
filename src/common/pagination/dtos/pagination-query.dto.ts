import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;
}
