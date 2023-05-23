import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PrismaExceptionInterceptor } from '@ticket-app/database';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      options: {
        host: process.env.HOST,
        port: process.env.USER_TCP_PORT
      }
    },
  );

  app.useGlobalInterceptors(new PrismaExceptionInterceptor());
  await app.listen();
  Logger.log(`User microservice running on ${process.env.USER_TCP_PORT} (TCP)`);
}
bootstrap();