import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { OrderModule } from './orders/order.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [UsersModule, AuthModule, EventModule, OrderModule, SearchModule],
})
export class AppModule {}
