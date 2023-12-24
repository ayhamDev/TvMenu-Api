import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";
import { AuthService } from "src/auth/auth.service";
import { AdminService } from "src/admin/admin.service";
import { ClientService } from "src/client/client.service";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { Client } from "src/client/entities/client.entity";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { Device } from "./entities/device.entity";
import { UnregisteredService } from "src/unregistered/unregistered.service";
import { Unregistered } from "src/unregistered/entities/unregistered.entity";
import { Program } from "src/program/entities/program.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, Unregistered, Program, Admin, Client]),
  ],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    AuthService,
    AdminService,
    UnregisteredService,
    ClientService,
    HashPasswordService,
    CleanPromiseService,
  ],
})
export class DeviceModule {}
