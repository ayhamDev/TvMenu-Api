import { IDates } from "@interface/Dates/Dates.interface";
import { UUID } from "crypto";
import { Device } from "src/device/entities/device.entity";
import { IDevice } from "src/device/interface/device.interface";
import { IProgram } from "src/program/interface/program.interface";

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

  Devices?: IDevice[];

  Programs?: IProgram[];

  createdAt: Date;

  updatedAt: Date;
}
