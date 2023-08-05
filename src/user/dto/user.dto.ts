import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty() phoneNumber: string;
  role: string;
}

export class LoginUserDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() password: string;
}

export class UpdateUserDto {
  name: string;
  phoneNumber: string;
  role: string;
  password: string;
}

export class UpdatePassword {
  @IsNotEmpty()
  @Length(6, 20)
  old_password: string;
  @IsNotEmpty()
  @Length(6, 20)
  new_password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}

export class OptionsQueryUser {
  page: string;
  limit: string;
  keyword: string;
}
