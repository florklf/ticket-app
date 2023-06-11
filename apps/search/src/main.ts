import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SearchModule } from './app/search.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PrismaExceptionInterceptor } from '@ticket-app/database';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      options: {
        host: process.env.HOST,
        port: process.env.SEARCH_TCP_PORT,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new PrismaExceptionInterceptor());
  await app.listen();
  Logger.log(`Search microservice running on ${process.env.SEARCH_TCP_PORT} (TCP)`);
}

bootstrap();
