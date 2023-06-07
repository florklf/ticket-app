import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSeatTypeService } from './event-seat-type.service';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule],
  providers: [EventService, EventSeatTypeService],
  controllers: [EventController],
})
export class EventModule {}
