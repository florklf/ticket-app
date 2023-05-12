import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@ticket-app/database';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const message = exception.message.replace(/\n/g, '');
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return new RpcException(new ConflictException(message));
        // return throwError(() => new ConflictException(message));
        case 'P2025':
          throw new RpcException(new NotFoundException(message));
        // return throwError(() => new NotFoundException());
        default:
          throw new RpcException(new HttpException(message, 500));
        // return throwError(() => new HttpException(message, 500));
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      throw new RpcException(new BadRequestException(message));
    }
  }
}
