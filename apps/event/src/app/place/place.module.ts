import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule],
  providers: [PlaceService],
  controllers: [PlaceController],
})
export class PlaceModule {}
