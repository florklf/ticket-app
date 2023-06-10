import { Injectable } from '@nestjs/common';
import { Order, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async order(params: {
        where?: Prisma.OrderWhereInput
        include?: Prisma.OrderInclude;
    }): Promise<Order | null> {
        const { where, include } = params;
        return this.prisma.order.findFirstOrThrow({
            where,
            include,
        });
    }

    async orders(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderWhereUniqueInput;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
    }): Promise<Order[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.order.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async verifyOrder(where: Prisma.QRCodeWhereInput): Promise<Order> {
        // Get QR code
        const qrCode = await this.prisma.qRCode.findFirstOrThrow({
            where,
            include: {
            OrderItem: {
                include: {
                order: true,
                },
            },
            },
        });
        // Check if order is paid
        const order = await this.prisma.orderItem.findUniqueOrThrow({
            where: {
                id: qrCode.order_item_id
            },
            include: {
                order: {
                    include: {
                        payment: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstname: true,
                                lastname: true,
                                created_at: true,
                            }
                        }
                    }
                }
            }
        });
        if (order.order.payment.status !== 'Paid') {
          throw new Error('Order not paid');
        }
        // Check if QR code is already used
        if (qrCode.qr_code_scan) {
          throw new Error('QR code already used');
        }
        // Update QR code
        await this.prisma.qRCode.update({
          where: {
            id: qrCode.id,
          },
          data: {
            qr_code_scan: new Date(),
          },
        });
        return order.order;
    }
}
