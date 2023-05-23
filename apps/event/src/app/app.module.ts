import { Module } from '@nestjs/common';

import { PlaceModule } from './place/place.module';
import { EventModule } from './event/event.module';
import { SeatTypeModule } from './seat-type/seat-type.module';

@Module({
  imports: [EventModule, PlaceModule, SeatTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
