import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { DatabaseModule } from '@ticket-app/database';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'EVENT_CLIENT',
        options: {
          host: process.env.HOST,
          port: process.env.EVENT_TCP_PORT,
        },
      },
    ]),
  ],
  controllers: [EventController],
  providers: [],
})
export class EventModule {}
