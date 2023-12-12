import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsEmpty } from "class-validator";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsEmpty()
  password: string;

  @IsEmpty()
  email: string;
}
