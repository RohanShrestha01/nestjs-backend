import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '../common/pagination/pagination.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    PaginationModule,
    UsersModule,
    TagsModule,
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
