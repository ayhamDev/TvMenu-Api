import { IsNotEmpty, IsOptional, IsIn } from "class-validator";

export class CreateDeviceDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  Token: string;

  @IsNotEmpty()
  Name: string;

  @IsOptional()
  Description: string;

  @IsOptional()
  ConnectionID: string;

  @IsOptional()
  Offline_Image: string;

  @IsIn(["Active", "Suspended"], {
    message: "Invalid Status Value, Only Active And Suspended Are Valid Status",
  })
  Status: string;

  @IsOptional()
  Status_Message: string;

  @IsOptional()
  Last_Online: Date;
}
