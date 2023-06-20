import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Logger } from '@nestjs/common';
import { Prisma, User } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy) {}

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
