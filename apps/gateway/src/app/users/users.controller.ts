import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Logger, Query, ValidationPipe } from '@nestjs/common';
import { Prisma, User } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindUsersDto } from '@ticket-app/common';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy) {}

  @Get('count')
  async countEvents(@Query(new ValidationPipe({transform:true})) query: FindUsersDto): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'countUsers' }, { role: query.role ?? undefined })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await lastValueFrom(await this.client.send({ cmd: 'findUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
    const {password, ...result} = user;
    return result;
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<Omit<User[], 'password'>> {
    const users = await lastValueFrom(await this.client.send({ cmd: 'findUsers' }, {}));
    const result = users.map(user => {
      const {password, ...rest} = user;
      return rest;
    });
    return result;
  }

  @Get(':id/orders')
  async findUserOrders(@Param('id') id: string): Promise<User> {
    Logger.log(id);
    return await lastValueFrom(await this.client.send({ cmd: 'findUserOrders' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }


  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
      const user = await lastValueFrom(await this.client.send({ cmd: 'createUser' }, createUserDto)
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
      const {password, ...result} = user;
      return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
    Logger.log(id)
    const user = await lastValueFrom(
      await this.client.send(
        { cmd: 'updateUser' },
        {
          where: { id: +id },
          data: updateUserDto,
        }
      )
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
    const {password, ...result} = user;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await lastValueFrom(await this.client.send({ cmd: 'removeUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
    const {password, ...result} = user;
    return result;
  }
}
