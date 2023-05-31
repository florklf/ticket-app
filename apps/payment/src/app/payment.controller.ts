import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@ApiTags('payment')
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'createPayment' })
  async createPayment(data: Prisma.PaymentCreateInput) {
    return await this.paymentService.createPayment(data);
  }

  @MessagePattern({ cmd: 'findPayment' })
  async getPayment(data: Prisma.PaymentWhereUniqueInput) {
    return await this.paymentService.getPayment(data);
  }

  @MessagePattern({ cmd: 'findPayments' })
  async getPayments() {
    return await this.paymentService.getPayments({});
  }

  @MessagePattern({ cmd: 'updatePayment' })
  async updatePayment(@Payload('where') where: Prisma.UserWhereUniqueInput, @Payload('data') data: Prisma.PaymentUpdateInput) {
    return await this.paymentService.updatePayment({where, data});
  }

  @MessagePattern({ cmd: 'removePayment' })
  async removePayment(data: Prisma.PaymentWhereUniqueInput) {
    return await this.paymentService.removePayment(data);
  }
}
