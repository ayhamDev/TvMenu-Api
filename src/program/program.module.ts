import { Module } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { ProgramController } from "./program.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "./entities/program.entity";
import { AuthService } from "src/auth/auth.service";
import { AdminService } from "src/admin/admin.service";
import { ClientService } from "src/client/client.service";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { Admin } from "src/admin/entities/admin.entity";
import { Client } from "src/client/entities/client.entity";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { DeviceService } from "src/device/device.service";
import { Device } from "src/device/entities/device.entity";
import { UnregisteredService } from "src/unregistered/unregistered.service";
import { Unregistered } from "src/unregistered/entities/unregistered.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Device, Unregistered, Admin, Client]),
  ],
  controllers: [ProgramController],
  providers: [
    ProgramService,
    AuthService,
    AdminService,
    ClientService,
    DeviceService,
    UnregisteredService,
    HashPasswordService,
    CleanPromiseService,
  ],
})
export class ProgramModule {}
