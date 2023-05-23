import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app/auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      options: {
        host: process.env.HOST,
        port: process.env.AUTH_TCP_PORT
      }
    },
  );

  await app.listen();
  Logger.log(`Auth microservice running on ${process.env.AUTH_TCP_PORT} (TCP)`);
}

bootstrap();
