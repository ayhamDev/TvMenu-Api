import { IsIP, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddUnregisteredDeviceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsIP()
  ipAddress: string;
}
