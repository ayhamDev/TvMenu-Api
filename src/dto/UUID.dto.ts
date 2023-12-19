import { IsUUID } from "class-validator";

export class uuidDto {
  @IsUUID("all")
  id: string;
}
