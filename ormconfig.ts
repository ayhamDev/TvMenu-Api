import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { Admin } from "./src/admin/entities/admin.entity";
import { Client } from "./src/client/entities/client.entity";
import { Device } from "./src/device/entities/device.entity";
import { Program } from "./src/program/entities/program.entity";
import { Unregistered } from "./src/unregistered/entities/unregistered.entity";
import { DataSource } from "typeorm";

config();
const configService = new ConfigService();

export default new DataSource({
  type: "mssql",
  host: configService.get<string>("DB_HOST"),
  port: 1433,
  username: configService.get<string>("DB_USER"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB"),
  options: {
    encrypt: false,
  },
  migrations: ["migrations/**"],
  entities: [Device, Program, Client, Admin, Unregistered],
});
