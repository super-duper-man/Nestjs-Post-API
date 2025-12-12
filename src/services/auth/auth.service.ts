import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UserEntity, UserRole } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exitsUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!exitsUser)
      throw new ConflictException(
        'کاربری با این ایمیل آدرس قبلا ساخته شده است',
      );

    const newUser = this.userRepo.create({
      ...dto,
      password: await this.hashPassword(dto.password),
      role: UserRole.USER,
    });

    const { password, ...result } = await this.userRepo.save(newUser);

    return {
      user: result,
      message: 'User Registered Successfully',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user || (await !this.verifyPassword(dto.password, user.password)))
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'super_secret_refresh_sign',
      }) as {
        sub: number;
      };

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });

      if (!user) throw new UnauthorizedException('توکن وارد شده معتبر نیست');

      const accessToken = this.generateAccessToken(user);
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('توکن وارد شده معتبر نیست');
    }
  }

  private async generateTokens(user: UserEntity) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: UserEntity) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: 'super_secret_sign',
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: UserEntity) {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: 'super_secret_refresh_sign',
      expiresIn: '7d',
    });
  }

  private async verifyPassword(
    password: string,
    dbPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, dbPass);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 24);
  }
}
