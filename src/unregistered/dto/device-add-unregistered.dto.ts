import { IsIP, IsNotEmpty, IsString } from "class-validator";

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
