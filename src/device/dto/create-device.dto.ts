import { IsString, IsOptional, IsIn } from "class-validator";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { CreateProgramDto } from "src/program/dto/create-program.dto";

export class CreateDeviceDto {
  @IsString()
  id: string;

  @IsString()
  Token: string;

  @IsString()
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

  @IsOptional()
  Client: CreateClientDto;

  @IsOptional()
  Programs: CreateProgramDto[];
}
