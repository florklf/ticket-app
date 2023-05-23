import { Controller, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User, Prisma, PrismaClientExceptionFilter } from '@ticket-app/database';

@Controller()
@UseFilters(new PrismaClientExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'findUser' })
  async getUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.findOne(data);
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

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser(data: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    return await this.userService.updateUser(data);
  }

  @MessagePattern({ cmd: 'removeUser' })
  async removeUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.deleteUser(data);
  }
}
