import { IDates } from "@interface/Dates/Dates.interface";
import { UUID } from "crypto";

export interface IClient extends IDates {
  id: UUID;
  email: string;
  password: string;
  Store_Name: string;
  Country: string;
  State: string;
  City: string;
  Address: string;
  Zip_Code: string;
}
