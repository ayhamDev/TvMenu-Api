import {
  IsString,
  IsOptional,
  IsIn,
  isDate,
  IsDate,
  IsNotEmpty,
} from "class-validator";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { CreateProgramDto } from "src/program/dto/create-program.dto";

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  connectionID: string;

  @IsOptional()
  offlineImage: string;

  @IsIn(["Active", "Suspended"], {
    // message: "Invalid Status Value, Only Active And Suspended Are Valid Status",
  })
  status: string;

  @IsOptional()
  statusMessage: string;

  @IsOptional()
  @IsDate()
  lastOnline: Date;

  @IsOptional()
  client: CreateClientDto;

  @IsOptional()
  programs: CreateProgramDto[];
}
