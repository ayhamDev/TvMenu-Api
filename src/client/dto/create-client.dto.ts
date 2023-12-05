import {
  IsString,
  IsOptional,
  IsStrongPassword,
  IsEmail,
  IsNotEmpty,
} from "class-validator";
import { CreateDeviceDto } from "src/device/dto/create-device.dto";
import { CreateProgramDto } from "src/program/dto/create-program.dto";

export class CreateClientDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsOptional()
  devices: CreateDeviceDto[];

  @IsOptional()
  programs: CreateProgramDto[];
}
