import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@ticket-app/database';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseFilters(PrismaClientExceptionFilter)
export class UsersController {
  constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput): Promise<User> {
    return await lastValueFrom(await this.client.send({ role: 'user', cmd: 'create' }, createUserDto));
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return await lastValueFrom(await this.client.send({ role: 'user', cmd: 'findAll' }, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ role: 'user', cmd: 'findOne' }, {id: +id}));
  }

  @Patch(':id')
  async update(@Param() id: string, @Body() updateUserDto: Prisma.UserUpdateInput): Promise<User> {
    return await lastValueFrom(await this.client.send({ role: 'user', cmd: 'update' }, {
      where: {id: +id},
      data: updateUserDto
    }));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ role: 'user', cmd: 'remove' }, {id: +id}));
  }
}
