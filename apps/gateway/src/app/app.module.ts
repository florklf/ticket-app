import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { PaymentModule } from './payments/payment.module';

@Module({
  imports: [UsersModule, AuthModule, EventModule, PaymentModule],
})
export class AppModule {}
