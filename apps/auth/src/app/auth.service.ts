import { Injectable, Inject, Logger, RequestTimeoutException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, lastValueFrom, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const res = await this.client.send({ cmd: 'findUser' }, { email: email })
      .pipe(timeout(5000), catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException())
        }
        Logger.log(err);
        return throwError(() => err);
      }));
      const user = await lastValueFrom(res);

      const isMatch = await compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch(e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const payload = { user, sub: user.id};

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
