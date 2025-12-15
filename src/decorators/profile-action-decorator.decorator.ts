import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from './role.decorator';
import { UserRole } from 'src/auth/entities/user.entity';

export function ProfileActionDecorator (...roles: UserRole[]) {
    return applyDecorators(
        ApiBearerAuth('Bearer'),
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(...roles)
    );
};
