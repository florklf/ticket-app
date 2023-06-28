import { Controller, Inject, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientProxy, MessagePattern, RpcException } from '@nestjs/microservices';
import { User, Prisma } from '@ticket-app/database';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('ORDER_CLIENT') private readonly client: ClientProxy
  ) {}

  @MessagePattern({ cmd: 'findUser' })
  async getUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.findOne({
      where: data,
      include: {
        Order: {
          include: {
            user: true,
          },
        }
      }
    });
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await this.userService.hashPassword(data.password);
    return await this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'findUsers' })
  async findAll(data: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return await this.userService.users(data);
  }

  @MessagePattern({ cmd: 'findUserOrders' })
  async findUserOrders(data: { id: number }): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'findUserOrders' }, data.id)
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser(payload: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    if (payload.data?.password) {
      payload.data.password = await this.userService.hashPassword(payload.data.password as string);
    }
    return await this.userService.updateUser(payload);
  }

  @MessagePattern({ cmd: 'removeUser' })
  async removeUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.deleteUser(data);
  }

  @MessagePattern({ cmd: 'countUsers' })
  async countUsers(data: Prisma.EventWhereInput): Promise<number> {
    Logger.log(data);
    return await this.userService.countUsers(data);
  }
}
