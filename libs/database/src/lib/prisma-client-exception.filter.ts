import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@ticket-app/database';
import { RpcException } from '@nestjs/microservices';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const message = exception.message.replace(/\n/g, '');
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return new RpcException(new ConflictException(message));
        case 'P2025':
          return new RpcException(new NotFoundException(message));
        default:
          return new RpcException(new HttpException({ cause: new Error(message)}, 500));
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
        return new RpcException(new BadRequestException(exception));
    }
  }
}
