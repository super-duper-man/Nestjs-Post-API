import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: 'توکن فراهم نشده است' })
  refreshToken: string;
}
