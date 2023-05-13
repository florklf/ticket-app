import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [EventModule, PlaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
