import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type-enum';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @Body() createEventDto: CreateEventDto,
    @ActiveUser('sub') userId: number,
  ) {
    return this.eventsService.create(createEventDto, userId);
  }

  @Get()
  @Auth(AuthType.None)
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.eventsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @Auth(AuthType.None)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
