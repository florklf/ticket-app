import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { EventModule } from './event/event.module';
import { SeatTypeModule } from './seat-type/seat-type.module';

@Module({
  imports: [EventModule, PlaceModule, SeatTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
