import { IsNotEmpty, IsString } from "class-validator";

export class UpdateClientDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;
}
