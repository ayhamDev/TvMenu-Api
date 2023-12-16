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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  layerNumber: number;

  @IsIn([1, 2, 3])
  type: number;

  @IsNotEmpty()
  @IsString()
  webUrl: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  videoUrl: string;

  @IsNotEmpty()
  @IsIn(["Active", "Suspended"])
  status: string;

  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;

  @IsNotEmpty()
  @IsPositive()
  width: number;

  @IsNotEmpty()
  @IsPositive()
  height: number;

  @IsNotEmpty()
  @IsPositive()
  duration: number;

  @IsNotEmpty()
  @IsPositive()
  nextLoop: number;

  @IsIn(EnterAnimationValues)
  enterAnimation: string;

  @IsIn(LeaveAnimationValues)
  leaveAnimation: string;

  @IsNotEmpty()
  @IsString()
  startDateTime: string;

  @IsNotEmpty()
  @IsString()
  endDateTime: string;

  @IsOptional()
  client: CreateClientDto;

  @IsOptional()
  devices: CreateDeviceDto[];
}
