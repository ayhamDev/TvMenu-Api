import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUnregisteredDeviceDto {
  @IsNotEmpty()
  @IsString()
  ipAddress: string;
}
