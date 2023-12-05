import { IDates } from "@interface/Dates/Dates.interface";

export interface UnregisteredInterface extends IDates {
  id: string;

  Token: string;

  IpAddress: string;

  RequestedCount: number;
}
