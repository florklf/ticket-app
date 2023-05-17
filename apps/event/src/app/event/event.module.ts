import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DatabaseModule } from '@ticket-app/database';

@Module({
  imports: [DatabaseModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
