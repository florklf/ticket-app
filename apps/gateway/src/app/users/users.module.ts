import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@ticket-app/database';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule,
    ClientsModule.register([{
      name: 'USER_CLIENT',
      options: {
        host: process.env.HOST,
        port: process.env.USER_TCP_PORT,
      }
    }]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      options: {
        host: process.env.HOST,
        port: process.env.AUTH_TCP_PORT
      }
    }]),
  ],
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
