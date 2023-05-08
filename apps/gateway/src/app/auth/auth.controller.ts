import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login-dto';
import { lastValueFrom } from 'rxjs';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_CLIENT') private readonly client: ClientProxy) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            return await lastValueFrom(await this.client.send({ role: 'auth', cmd: 'login' }, loginDto));
        } catch(e) {
          return false;
        }
    }

    @ApiBearerAuth()
    @Get('check')
    async loggedIn(@Req() req) {
        try {
            return await lastValueFrom(await this.client.send({ role: 'auth', cmd: 'check' }, { jwt: req.headers['authorization']?.split(' ')[1]}));
        } catch(e) {
          return false;
        }
    }
}
