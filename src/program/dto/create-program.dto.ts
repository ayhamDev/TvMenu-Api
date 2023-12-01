import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { CreateDeviceDto } from "src/device/dto/create-device.dto";
import { EnterAnimationValues } from "../interface/enter-animation.interface";
import { LeaveAnimationValues } from "../interface/leave-animation.interface";

export class CreateProgramDto {
  @IsString()
  Name: string;

  @IsOptional()
  Description: string;

  @IsNumber()
  LayerNumber: number;

  @IsIn([1, 2, 3])
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

  @IsPositive()
  Width: number;

  @IsPositive()
  Height: number;

  @IsPositive()
  Duration: number;

  @IsPositive()
  NextLoop: number;

  @IsIn(EnterAnimationValues)
  EnterAnimation: string;

  @IsIn(LeaveAnimationValues)
  LeaveAnimation: string;

  @IsString()
  StartDateTime: string;

  @IsString()
  EndDateTime: string;

  @IsOptional()
  Client: CreateClientDto;

  @IsOptional()
  Devices: CreateDeviceDto[];
}
