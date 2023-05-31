/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { PaymentModule } from './app/payment.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: process.env.PAYMENT_TCP_PORT,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  Logger.log(`Payment microservice running on ${process.env.PAYMENT_TCP_PORT} (TCP)`);
}

bootstrap();
