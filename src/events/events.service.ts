import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { Paginated } from '../common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly paginationProvider: PaginationProvider,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    const organizer = await this.usersService.findOne(userId);
    const tags =
      createEventDto.tags &&
      (await this.tagsService.findMany(createEventDto.tags));
    const event = this.eventsRepository.create({
      ...createEventDto,
      organizer,
      tags,
    });
    return await this.eventsRepository.save(event);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Event>> {
    return await this.paginationProvider.paginateQuery(
      paginationQueryDto,
      this.eventsRepository,
    );
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: { organizer: true, tags: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventsRepository.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');

    const tags = updateEventDto.tags
      ? await this.tagsService.findMany(updateEventDto.tags)
      : event.tags;

    Object.assign(event, { ...updateEventDto, tags });

    return await this.eventsRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.eventsRepository.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');
    return await this.eventsRepository.remove(event);
  }
}
