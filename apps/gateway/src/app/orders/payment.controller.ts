import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Headers, UseGuards } from '@nestjs/common';
import { EnumRole, Payment } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto, UpdatePaymentDto } from '@ticket-app/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/decorators/roles.decorator';

@Controller('payments')
@ApiTags('payments')
export class PaymentController {
  constructor(@Inject('ORDER_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return await lastValueFrom(await this.client.send({ cmd: 'findPayment' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async findAll(): Promise<Payment[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findPayments' }, {})
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post()
  @ApiBody({ type: CreatePaymentDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async create(@Body(new ValidationPipe) createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await lastValueFrom(await this.client.send({ cmd: 'createPayment' }, createPaymentDto)
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePaymentDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body(new ValidationPipe) updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updatePayment' },
        {
          where: { id: +id },
          data: updatePaymentDto,
        }
      )
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<Payment> {
    return await lastValueFrom(await this.client.send({ cmd: 'removePayment' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Post('hook')
  async handleSnipcartWebhook(@Headers('x-snipcart-requesttoken') snipcartRequestToken: string, @Body() body: any): Promise<any> {
    return await lastValueFrom(await this.client.send({ cmd: 'handleSnipcartWebhook' }, { snipcartRequestToken, body })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
