import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
