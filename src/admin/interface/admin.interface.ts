import { IDates } from "@interface/Dates/Dates.interface";
import { UUID } from "crypto";

export interface IAdmin extends IDates {
  id: UUID;
  email: string;
  password: string;
}
