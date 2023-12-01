import { Client } from "src/client/entities/client.entity";

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

  Client: Client;

  createdAt: Date;

  updatedAt: Date;
}
