import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class ClientDeleteManyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
