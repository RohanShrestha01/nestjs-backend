import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  async paginateQuery<T extends ObjectLiteral>(
    { limit, page }: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const data = await repository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await repository.count();

    return {
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      data,
    };
  }
}
