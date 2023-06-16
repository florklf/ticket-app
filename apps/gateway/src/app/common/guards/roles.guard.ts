import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnumRole } from '@ticket-app/database';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<EnumRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { jwtPayload } = context.switchToHttp().getRequest();
    if (!jwtPayload) return false;
    return jwtPayload.user?.role == requiredRole;
  }
}
