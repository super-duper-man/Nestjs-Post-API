import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
    email: string;

    @IsNotEmpty({ message: 'رمز عبور الزامی است' })
    @MinLength(4, { message: 'رمز عبور حداقل باید شامل 4 کارکتر باشد' })
    password: string;
}