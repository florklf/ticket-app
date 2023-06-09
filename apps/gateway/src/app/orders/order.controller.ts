import { Controller, Get, Inject, UseGuards, Request, Query, Param } from '@nestjs/common';
import { Order } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(@Inject('ORDER_CLIENT') private readonly client: ClientProxy) { }

  /**
   * We consider that every request to the orders service will be made by an authenticated user.
   * This is why we use the AuthGuard to check if the user is authenticated.
   * If the user is authenticated, the AuthGuard will add the user object to the request object.
   * We can then use the user object to get the user id and send it to the orders service.
  **/

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll(@Request() req: Request & { jwtPayload: any }): Promise<Order[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findOrders' }, req.jwtPayload.user.id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string, @Query('include') include: boolean, @Request() req: Request & { jwtPayload: any }): Promise<Order> {
    return await lastValueFrom(await this.client.send({ cmd: 'findOrder' }, { id: +id, user_id: req.jwtPayload?.user?.id, include })
      .pipe(catchError(error => throwError(() => new RpcException(error)))));
  }
}
