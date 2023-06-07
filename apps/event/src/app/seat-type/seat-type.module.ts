import { Module } from '@nestjs/common';
import { SeatTypeService } from './seat-type.service';
import { SeatTypeController } from './seat-type.controller';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule],
  providers: [SeatTypeService],
  controllers: [SeatTypeController],
})
export class SeatTypeModule {}
