import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RcpExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost): void {
    const error: any = exception.getError();
    Logger.log(error);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
    .status(error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR)
    .json(error);
  }
}
