import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class AdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
