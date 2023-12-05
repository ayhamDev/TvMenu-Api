import { IDates } from "@interface/Dates/Dates.interface";
import { IClient } from "src/client/interface/client.interface";
import { IProgram } from "src/program/interface/program.interface";

export interface IDevice extends IDates {
  id: string;

  token: string;

  name: string;

  description: string;

  connectionID: string;

  offlineImage: string;

  status: string;

  statusMessage: string;

  lastOnline: Date;

  client?: IClient;
  programs?: IProgram;
}
