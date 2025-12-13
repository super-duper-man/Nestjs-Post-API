import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { RefreshDto } from 'src/auth/dtos/refresh.dto';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AuthService } from 'src/services/auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'register user' })
  @ApiResponse({ status: 201, description: 'Created user returned' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() userDto: RegisterDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  refreshToken(@Body() token: RefreshDto) {
    return this.authService.refreshToken(token.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user:any){
    return user;
  }
}
