import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app/auth.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: process.env.AUTH_TCP_PORT
    }
  });

  await app.startAllMicroservices();
  Logger.log(`Auth microservice running on ${process.env.AUTH_TCP_PORT} (TCP)`);
}

bootstrap();
