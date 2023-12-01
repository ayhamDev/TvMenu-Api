import { IsEmail, IsStrongPassword, Min } from "class-validator";

export class AdminDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
