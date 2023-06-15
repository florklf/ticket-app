import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { OrderController } from './order.controller';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule,
    ClientsModule.register([
      {
        name: 'ORDER_CLIENT',
        options: {
          host: process.env.ORDER_TCP_HOST,
          port: process.env.ORDER_TCP_PORT,
        },
      },
    ]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      options: {
        host: process.env.AUTH_TCP_HOST,
        port: process.env.AUTH_TCP_PORT
      }
    }]),
  ],
  controllers: [OrderController, PaymentController],
  providers: [],
})
export class OrderModule {}
