import { Injectable } from '@nestjs/common';
import { Payment, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getPayment(paymentWhereUniqueInput: Prisma.PaymentWhereUniqueInput): Promise<Payment | null> {
    return this.prisma.payment.findUniqueOrThrow({
      where: paymentWhereUniqueInput,
    });
  }

  async getPayments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentWhereUniqueInput;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput;
  }): Promise<Payment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.payment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  async updatePayment(params: { where: Prisma.PaymentWhereUniqueInput; data: Prisma.PaymentUpdateInput }): Promise<Payment> {
    const { where, data } = params;
    return this.prisma.payment.update({
      data,
      where,
    });
  }

  async removePayment(where: Prisma.PaymentWhereUniqueInput): Promise<Payment> {
    return this.prisma.payment.delete({
      where,
    });
  }
}
