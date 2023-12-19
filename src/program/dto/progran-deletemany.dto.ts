import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class ProgramDeleteManyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
