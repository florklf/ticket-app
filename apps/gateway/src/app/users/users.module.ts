import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@ticket-app/common';

@Module({
  imports: [CommonModule,
    ClientsModule.register([{
      name: 'USER_CLIENT',
      options: {
        host: process.env.USER_TCP_HOST,
        port: process.env.USER_TCP_PORT,
      }
    }]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      options: {
        host: process.env.AUTH_TCP_HOST,
        port: process.env.AUTH_TCP_PORT
      }
    }]),
  ],
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
