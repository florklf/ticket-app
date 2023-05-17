import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: process.env.USER_TCP_PORT
    }
  });

  await app.startAllMicroservices();
  Logger.log(`User microservice running on ${process.env.USER_TCP_PORT} (TCP)`);
}
bootstrap();