import {
  IsEmail,
  IsString,
  IsOptional,
  IsStrongPassword,
  IsString,
} from "class-validator";
import { CreateDeviceDto } from "src/device/dto/create-device.dto";
import { CreateProgramDto } from "src/program/dto/create-program.dto";

export class CreateClientDto {
  @IsString()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  StoreName: string;

  @IsString()
  Country: string;

  @IsString()
  State: string;

  @IsString()
  City: string;

  @IsString()
  Address: string;

  @IsString()
  ZipCode: string;

  @IsOptional()
  Devices: CreateDeviceDto[];

  @IsOptional()
  Programs: CreateProgramDto[];
}
