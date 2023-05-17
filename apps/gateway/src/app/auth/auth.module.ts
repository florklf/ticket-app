import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([{
        name: 'AUTH_CLIENT',
        options: {
          host: process.env.HOST,
          port: process.env.AUTH_TCP_PORT
        }
      }])
    ],
    controllers: [AuthController],
    providers: [],
  })
  export class AuthModule {}