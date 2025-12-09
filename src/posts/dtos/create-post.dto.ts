import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({ message: 'عنوان پست نباید خالی باشد' })
    @IsString({ message: 'عنوان پست باید یک رشته باشد' })
    @MinLength(3, { message: 'عنوان پست باید حداقل ۳ کاراکتر باشد' })
    @MaxLength(100, { message: 'عنوان پست باید حداکثر ۱۰۰ کاراکتر باشد' })
    title: string;
    @IsNotEmpty({ message: 'متن پست نباید خالی باشد' })
    @IsString({ message: 'عنوان پست باید یک رشته باشد' })
    @MinLength(3, { message: 'متن پست باید حداقل ۳ کاراکتر باشد' })
    content: string;
    @IsNotEmpty({ message: 'فرستنده پست نباید خالی باشد' })
    @IsString({ message: 'فرستنده پست باید یک رشته باشد' })
    @MinLength(3, { message: 'فرستنده پست باید حداقل ۳ کاراکتر باشد' })
    author: string;
}