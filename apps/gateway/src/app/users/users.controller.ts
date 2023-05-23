import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
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
  async findOne(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'findUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findUsers' }, {}));
  }

  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput): Promise<User> {
      return await lastValueFrom(await this.client.send({ cmd: 'createUser' }, createUserDto)
      .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Patch(':id')
  async update(@Param() id: string, @Body() updateUserDto: Prisma.UserUpdateInput): Promise<User> {
    return await lastValueFrom(
      await this.client.send(
        { cmd: 'updateUser' },
        {
          where: { id: +id },
          data: updateUserDto,
        }
      )
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }
}
