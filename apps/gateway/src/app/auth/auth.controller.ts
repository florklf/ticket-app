import { Body, Controller, Get, Inject, Logger, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login-dto';
import { lastValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientProxy) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await lastValueFrom(await this.client.send({ cmd: 'login' }, loginDto));
    } catch (e) {
      return false;
    }
  }

  @ApiBearerAuth()
  @Get('check')
  async loggedIn(@Req() req) {
    try {
      return await lastValueFrom(await this.client.send({ cmd: 'check' }, { jwt: req.headers['authorization']?.split(' ')[1] }));
    } catch (e) {
      throw new UnauthorizedException('Expired token');
    }
  }

  @Post('logout')
  async logout(@Req() req) {
    return true;
  }
}
