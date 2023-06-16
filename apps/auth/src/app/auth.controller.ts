import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(user) {
    try {
      return await this.authService.login(await this.authService.validateUser(user.email, user.password));
    } catch(e) {
      Logger.error(e);
      return false;
    }
  }

  @MessagePattern({ cmd: 'check' })
  async loggedIn(data: { jwt: string }) {
    try {
      return await this.authService.validateToken(data.jwt);
    } catch(e) {
      throw new RpcException('Expired token');
    }
  }
}
