import { Module } from '@nestjs/common';
import { SeatTypeService } from './seat-type.service';
import { SeatTypeController } from './seat-type.controller';
import { DatabaseModule } from '@ticket-app/database';

@Module({
  imports: [DatabaseModule],
  providers: [SeatTypeService],
  controllers: [SeatTypeController],
})
export class SeatTypeModule {}
