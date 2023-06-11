import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSeatTypeService } from './event-seat-type.service';
import { CommonModule } from '@ticket-app/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: 'SEARCH_CLIENT',
        options: {
          host: process.env.HOST,
          port: process.env.SEARCH_TCP_PORT,
        },
      },
    ]),
  ],
  providers: [EventService, EventSeatTypeService],
  controllers: [EventController],
})
export class EventModule {}
