import { Injectable } from '@nestjs/common';
import { Order, OrderItem, Prisma, PrismaService } from '@ticket-app/database';

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
}
