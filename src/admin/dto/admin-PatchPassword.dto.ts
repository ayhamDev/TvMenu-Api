import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class AdminPatchPasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
