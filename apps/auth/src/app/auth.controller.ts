import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ role: 'auth', cmd: 'login'})
  async login(user) {
    try {
      return await this.authService.login(await this.authService.validateUser(user.email, user.password));
    } catch(e) {
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'check'})
  async loggedIn(data) {
    try {
      return await this.authService.validateToken(data.jwt);
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
}