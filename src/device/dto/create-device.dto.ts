import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
