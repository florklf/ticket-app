import { Controller, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User, Prisma, PrismaClientExceptionFilter } from '@ticket-app/database';

@Controller()
@UseFilters(new PrismaClientExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'findOne' })
  async getUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.findOne(data);
  }

  @MessagePattern({ role: 'user', cmd: 'create' })
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.userService.createUser(data);
  }

  @MessagePattern({ role: 'user', cmd: 'findAll' })
  async findAll(data: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return await this.userService.users(data);
  }

  @MessagePattern({ role: 'user', cmd: 'update' })
  async updateUser(data: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return await this.userService.updateUser(data);
  }

  @MessagePattern({ role: 'user', cmd: 'remove' })
  async removeUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.deleteUser(data);
  }
}