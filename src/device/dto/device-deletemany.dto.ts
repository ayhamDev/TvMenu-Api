import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class DeviceDeleteManyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
