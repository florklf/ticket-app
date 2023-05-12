import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: process.env.ORDER_TCP_PORT
    }
  });

  await app.startAllMicroservices();
  Logger.log(`Order microservice running on ${process.env.ORDER_TCP_PORT} (TCP)`);
}

bootstrap();
