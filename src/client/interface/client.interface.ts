import { IDates } from "@interface/Dates/Dates.interface";
import { UUID } from "crypto";
import { Device } from "src/device/entities/device.entity";
import { IDevice } from "src/device/interface/device.interface";
import { IProgram } from "src/program/interface/program.interface";

export interface IClient extends IDates {
  id: UUID;

  email: string;

  password: string;

  storeName: string;

  country: string;

  state: string;

  city: string;

  address: string;

  zipCode: string;

  devices?: IDevice[];

  programs?: IProgram[];

  createdAt: Date;

  updatedAt: Date;
}
