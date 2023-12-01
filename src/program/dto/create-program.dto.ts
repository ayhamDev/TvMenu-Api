import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { CreateDeviceDto } from "src/device/dto/create-device.dto";

export class CreateProgramDto {
  @IsString()
  Name: string;

  @IsOptional()
  Description: string;

  @IsNumber()
  LayerNumber: number;

  @IsNumber()
  Type: number;

  @IsString()
  WebUrl: string;

  @IsString()
  ImageUrl: string;

  @IsString()
  VideoUrl: string;

  @IsString()
  Status: string;

  @IsNumber()
  X: number;

  @IsNumber()
  Y: number;

  @IsNumber()
  Width: number;

  @IsNumber()
  Height: number;

  @IsNumber()
  Duration: number;

  @IsNumber()
  NextLoop: number;

  @IsString()
  StartAnimation: string;

  @IsString()
  EndAnimation: string;

  @IsString()
  StartDateTime: string;

  @IsString()
  EndDateTime: string;

  @IsOptional()
  Client: CreateClientDto;

  @IsOptional()
  Devices: CreateDeviceDto[];
}
