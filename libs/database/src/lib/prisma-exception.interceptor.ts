import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException, ConflictException, HttpException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          const message = err.message.replace(/\n/g, '');
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
              case 'P2002':
                return throwError(() => new RpcException(new ConflictException(message)))
              case 'P2025':
                return throwError(() => new RpcException(new NotFoundException(message)))
              default:
                return throwError(() => new RpcException(new HttpException({ cause: new Error(message)}, 500)))
            }
          } else if (err instanceof Prisma.PrismaClientValidationError) {
            return throwError(() => new RpcException(new BadRequestException(err)));
          }
          return throwError(() => new RpcException(new InternalServerErrorException()));
        })
      );
  }
}
