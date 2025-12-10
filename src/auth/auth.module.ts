import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserEntity
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
