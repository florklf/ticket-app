import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: process.env.EVENT_TCP_PORT,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  Logger.log(`Event microservice running on ${process.env.EVENT_TCP_PORT} (TCP)`);
}

bootstrap();
