import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch(RpcException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    // response.status(error.statusCode).json(...error, { timestamp: new Date().toISOString(), path: request.url });
    //   path: request.url,);
    // response.json({
    //   ...exception,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}
