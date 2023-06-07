import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@ApiTags('order')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @MessagePattern({ cmd: 'findOrders' })
  async getOrders(id: number) {
    return await this.orderService.orders({ where: { user_id: id } });
  }

  @MessagePattern({ cmd: 'findOrder' })
  async getOrder({ id, user_id, include }: { id: number, user_id: number, include: boolean }) {
    try {
      return await this.orderService.order({
        where: { id, user_id },
        include: include ? {
          payment: true,
          orderItems: {
            include: {
              qrCode: true,
              seatType: {
                include: {
                  event: {
                    include: {
                      artist: true,
                      genre: true,
                      place: true,
                    }
                  },
                  seatType: true,
                }
              }
            }
          }
        } : undefined,
      });
    } catch (error) {
      throw new RpcException('Order not found');
    }
  }
}
