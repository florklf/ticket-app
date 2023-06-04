import { Module } from '@nestjs/common';

import { PlaceModule } from './place/place.module';
import { EventModule } from './event/event.module';
import { SeatTypeModule } from './seat-type/seat-type.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [EventModule, PlaceModule, SeatTypeModule, GenreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
