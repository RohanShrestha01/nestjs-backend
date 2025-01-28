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
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthType } from '../auth/enums/auth-type-enum';
import { Role } from '../auth/enums/role.enum';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.ORGANIZER)
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
  @Roles(Role.ADMIN, Role.ORGANIZER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.ORGANIZER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
