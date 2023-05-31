import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DatabaseModule } from '@ticket-app/database';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
