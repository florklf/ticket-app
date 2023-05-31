import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DatabaseModule } from '@ticket-app/database';
import { EventSeatTypeService } from './event-seat-type.service';

@Module({
  imports: [DatabaseModule],
  providers: [EventService, EventSeatTypeService],
  controllers: [EventController],
})
export class EventModule {}
