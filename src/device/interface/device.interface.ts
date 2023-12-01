import { IClient } from "src/client/interface/client.interface";
import { IProgram } from "src/program/interface/program.interface";

export interface IDevice {
  id: string;

  Token: string;

  Name: string;

  Description: string;

  ConnectionID: string;

  Offline_Image: string;

  Status: string;

  Status_Message: string;

  Last_Online: Date;

  Client?: IClient;
  Programs?: IProgram;

  createdAt: Date;

  updatedAt: Date;
}
