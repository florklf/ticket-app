import { Controller, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { VerifyOrderDto } from '@ticket-app/common';
import { Prisma } from '@prisma/client';
// import * as dayjs from 'dayjs'
import dayjs, { ManipulateType } from 'dayjs'
@ApiTags('order')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @MessagePattern({ cmd: 'findUserOrders' })
  async getUserOrders(id: number) {
    return await this.orderService.orders({
      where: { user_id: id },
      include: {
        payment: true,
        user: true,
        orderItems: {
          include: {
            seatType: {
              include: {
                seatType: true,
                event: true,
              }
            }
          }
        }
      }
    });
  }

  @MessagePattern({ cmd: 'findOrders' })
  async getOrders(id: number) {
    const orders = await this.orderService.orders({
      include: {
        payment: true,
        user: true,
        orderItems: {
          include: {
            seatType: {
              include: {
                seatType: true,
                event: true,
              }
            }
          }
        }
      }
    });
    return orders.map((order: any) => {
      const { user_id, user: { password, ...rest }, ...orderRest } = order;
      return { ...orderRest, user: rest };
    });
  }

  @MessagePattern({ cmd: 'findOrder' })
  async getOrder({ id, user_id, include }: { id: number, user_id: number, include: boolean }) {
    try {
      return await this.orderService.order({
        where: { id },
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

  @MessagePattern({ cmd: 'getBestSellingEvents' })
  async getBestSellingEvents({ time, limit }: { time: ManipulateType, limit: number }) {
    const orders = await this.orderService.orders({
      include: {
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
      },
      where: {
        created_at: {
          gte: time ? dayjs().subtract(1, time).toDate() : undefined
        }
      },
    }) as any;
    const eventCounts = {};
    let totalProductsSold = 0;

    for (const order of orders) {
        for (const item of order.orderItems) {
            const eventName = item.seatType.event.name;

            if (!eventCounts[eventName]) {
                eventCounts[eventName] = 0;
            }
            eventCounts[eventName] += item.quantity;
            totalProductsSold += item.quantity;
        }
    }

    const eventPercentages = [];
    for (const eventName in eventCounts) {
        const percentage = (eventCounts[eventName] / totalProductsSold) * 100;
        eventPercentages.push({
            name: eventName,
            count: eventCounts[eventName],
            percentage: percentage
        });
    }
    eventPercentages.sort((a, b) => b.count - a.count);
    return eventPercentages;
  }

  @MessagePattern({ cmd: 'verifyOrder' })
  async verifyPayment(@Payload(new ValidationPipe()) qrcode: VerifyOrderDto) {
    return await this.orderService.verifyOrder(qrcode);
  }
}
