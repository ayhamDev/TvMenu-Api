import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  offlineImage: string;

  @IsOptional()
  @IsString()
  connectionID: string;

  @IsOptional()
  @IsIn(["Active", "Suspended"])
  status: string;

  @IsOptional()
  @IsString()
  statusMessage: string;
}
export class UpdateManyDevicesDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  offlineImage: string;

  @IsOptional()
  @IsIn(["Active", "Suspended"])
  status: string;

  @IsOptional()
  @IsString()
  statusMessage: string;
}
