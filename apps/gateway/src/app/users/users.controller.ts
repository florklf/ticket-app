import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@ticket-app/database';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseFilters(CustomExceptionFilter)
export class UsersController {
  constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'findUser' }, { id: +id }));
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'findUsers' }, {}));
  }

  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'createUser' }, createUserDto));
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
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return await lastValueFrom(await this.client.send({ cmd: 'removeUser' }, { id: +id }));
  }
}
