import { IsEmail, Min } from "class-validator";

export class AdminDto {
  @IsEmail()
  email: string;

  @Min(3)
  password: string;
}
