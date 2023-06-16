import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PrismaExceptionInterceptor } from '@ticket-app/database';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      options: {
        host: process.env.ORDER_TCP_HOST,
        port: process.env.ORDER_TCP_PORT,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new PrismaExceptionInterceptor());
  await app.listen();
  Logger.log(`Order microservice running on ${process.env.ORDER_TCP_PORT} (TCP)`);
}

bootstrap();
