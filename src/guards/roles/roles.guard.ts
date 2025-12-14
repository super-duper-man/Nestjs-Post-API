import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/auth/entities/user.entity';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    //Reflector is a until to access metadata
    private reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]
    );
    if (!requiredRoles)
      return true;

    const { user } = context.switchToHttp().getRequest();
    if (user === undefined) {
      throw new ForbiddenException("کاربر دسترسی لازم را ندارد");
    }


    const hasRequiredRole = requiredRoles.some(role => {
      return user.role === role;
    });
    if (!hasRequiredRole)
      throw new ForbiddenException("کاربر دسترسی لازم را ندارد");

    return true;
  }
}
