import { Controller, Request, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Logger, Query, ValidationPipe } from '@nestjs/common';
import { EnumRole, Prisma, User } from '@ticket-app/database';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindUsersDto } from '@ticket-app/common';
import { Role } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(@Inject('USER_CLIENT') private readonly client: ClientProxy) {}

  @Get('count')
  async countEvents(@Query(new ValidationPipe({transform:true})) query: FindUsersDto): Promise<Event[]> {
    return await lastValueFrom(await this.client.send({ cmd: 'countUsers' }, { role: query.role ?? undefined })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async me(@Request() req: Request & { jwtPayload: { user: User } }): Promise<Omit<User, 'password'>> {
    return await lastValueFrom(await this.client.send({ cmd: 'currentUser' }, { id: +req.jwtPayload.user.id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await lastValueFrom(await this.client.send({ cmd: 'findUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
    const {password, ...result} = user;
    return result;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard, RolesGuard)
  @Role(EnumRole.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await lastValueFrom(await this.client.send({ cmd: 'removeUser' }, { id: +id })
    .pipe(catchError(error => throwError(() => new RpcException(error.response)))));
    const {password, ...result} = user;
    return result;
  }
}
