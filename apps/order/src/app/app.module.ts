import { Module } from '@nestjs/common';

import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [OrderModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
