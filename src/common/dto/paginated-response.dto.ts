import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class PaginatedResponseDto<T> {
  @ApiHideProperty()
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = { total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
