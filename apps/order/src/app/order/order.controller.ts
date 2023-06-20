import { Controller, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { VerifyOrderDto } from '@ticket-app/common';

@ApiTags('order')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @MessagePattern({ cmd: 'findUserOrders' })
  async getUserOrders(id: number) {
    return await this.orderService.orders({ where: { user_id: id } });
  }

  @MessagePattern({ cmd: 'findOrders' })
  async getOrders(id: number) {
    return await this.orderService.orders({
      include: {
        payment: true,
        user: true,
        orderItems: {
          include: {
            seatType: {
              include: {
                seatType: true,
              }
            }
          }
        }
      }
    });
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
                      eventArtists: true,
                      eventGenres: true,
                      place: true,
                      type: true,
                    }
                  },
                  seatType: true,
                }
              }
            }
          },
          user: true,
        } : undefined,
      });
    } catch (error) {
      throw new RpcException('Order not found');
    }
  }

  @MessagePattern({ cmd: 'verifyOrder' })
  async verifyPayment(@Payload(new ValidationPipe()) qrcode: VerifyOrderDto) {
    return await this.orderService.verifyOrder(qrcode);
  }
}
