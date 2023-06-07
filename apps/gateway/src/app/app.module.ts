import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [UsersModule, AuthModule, EventModule, OrderModule],
})
export class AppModule {}
