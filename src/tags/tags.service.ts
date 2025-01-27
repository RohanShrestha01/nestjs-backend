import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { Paginated } from '../common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Tag>> {
    return await this.paginationProvider.paginateQuery(
      paginationQueryDto,
      this.tagsRepository,
    );
  }

  async findMany(ids: number[]) {
    return await this.tagsRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException('Tag not found');
    Object.assign(tag, updateTagDto);
    return await this.tagsRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException('Tag not found');
    return await this.tagsRepository.softRemove(tag);
  }
}
