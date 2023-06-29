import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from '@ticket-app/common';
import { ClientsModule } from '@nestjs/microservices';

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
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
