import { Injectable } from '@nestjs/common';
import { Payment, Prisma, PrismaService } from '@ticket-app/database';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

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

  async orderCompleted(content: any): Promise<any> {
    // Create an order
    const userId = content.customFields.find((field: any) => field.name === 'userId').value;
    const order = await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: +userId,
          },
        },
        snipcart_id: content.token,
        billing_address: content.billingAddress.address1,
        billing_city: content.billingAddress.city,
        billing_country: content.billingAddress.country,
        billing_zip: content.billingAddress.postalCode,
        shipping_address: content.shippingAddress.address1,
        shipping_city: content.shippingAddress.city,
        shipping_country: content.shippingAddress.country,
        shipping_zip: content.shippingAddress.postalCode,
      },
    });
    // Create order items
    const orderItems = content.items.map((item: any) => {
      return {
        order_id: order.id,
        seat_type_id: +item.id,
        quantity: item.quantity,
      };
    });
    await this.prisma.orderItem.createMany({
      data: orderItems,
    });
    // Create payment
    await this.prisma.payment.create({
      data: {
        order_id: order.id,
        amount: content.total,
        status: content.paymentStatus,
        payment_method: content.paymentMethod,
        card_type: content.cardType,
        card_last4: +content.creditCardLast4Digits,
      },
    });
    // Update event seat availability
    const itemIds = content.items.map((item: any) => +item.id);
    const eventSeatTypes = await this.prisma.eventSeatType.findMany({
      where: {
        id: { in: itemIds },
      },
    });
    for (const eventSeatType of eventSeatTypes) {
      const item = content.items.find((item: any) => +item.id === eventSeatType.id);
      await this.prisma.eventSeatType.update({
        where: {
          id: eventSeatType.id,
        },
        data: {
          available_seats: {
            decrement: item.quantity,
          }
        },
      });
    }
    return true;
  }

  async handleSnipcartWebhook(snipcartRequestToken: string, body: any): Promise<any> {
    // Validate snipcart request
    try {
      const verifyToken = await fetch(`https://app.snipcart.com/api/requestvalidation/${snipcartRequestToken}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(process.env.SNIPCART_SECRET_KEY).toString('base64')}`,
        },
      });
      if (!verifyToken.ok) {
        throw new Error('Invalid Snipcart request token');
      }
    } catch (err) {
      console.log(`Error verifying Snipcart webhook token: ${err}`);
      return false;
    }
    // Handle event
    const { eventName, mode, content } = body;
    if (eventName === 'order.completed') {
      return await this.orderCompleted(content);
    }
    else if (eventName === 'order.status.changed') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'order.paymentStatus.changed') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'order.shippingStatus.changed') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'order.trackingNumber.changed') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'order.refund.created') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'order.notification.created') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else if (eventName === 'customauth:customer_updated') {
      throw new Error(`Not implemented for ${eventName}`);
    }
    else {
      throw new Error(`Not implemented for ${eventName}`);
    }
  }
}
