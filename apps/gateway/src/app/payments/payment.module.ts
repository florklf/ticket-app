import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from '@ticket-app/database';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_CLIENT',
        options: {
          host: process.env.HOST,
          port: process.env.PAYMENT_TCP_PORT,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
