import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class AdminDeleteManyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
