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
        host: process.env.HOST,
        port: process.env.EVENT_TCP_PORT,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new PrismaExceptionInterceptor());
  await app.listen();
  Logger.log(`Event microservice running on ${process.env.EVENT_TCP_PORT} (TCP)`);
}

bootstrap();
