import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { DatabaseModule } from '@ticket-app/database';

@Module({
  imports: [DatabaseModule],
  providers: [PlaceService],
  controllers: [PlaceController],
})
export class PlaceModule {}
