
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@ticket-app/database';
import { throwError } from 'rxjs';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const message = exception.message.replace(/\n/g, '');
    switch (exception.code) {
        case 'P2002':
            return throwError(() => new ConflictException(message));
        case 'P2025':
            return throwError(() => new NotFoundException(message));
        default:
            return throwError(() => new HttpException(message, 500));
    }
  }
}