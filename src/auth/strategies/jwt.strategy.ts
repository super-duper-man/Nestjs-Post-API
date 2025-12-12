import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/interfaces/payload.interface';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(process.env.JWT_SIGN_SECRET),
    });
  }

  async validate(payload: Payload) {
    try {
      const user = await this.authService.getCurrentUser(payload.sub);
      return { ...user, role: user.role };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
