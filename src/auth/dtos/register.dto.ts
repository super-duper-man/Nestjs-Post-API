import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  email: string;

  @IsNotEmpty({ message: 'نام الزامی است' })
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @MinLength(4, { message: 'رمز عبور حداقل باید شامل 4 کارکتر باشد' })
  password: string;
}
