import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class PatchPasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
