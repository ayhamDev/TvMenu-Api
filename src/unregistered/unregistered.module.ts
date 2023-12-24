import { Module } from "@nestjs/common";
import { UnregisteredService } from "./unregistered.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unregistered } from "./entities/unregistered.entity";
import { ClientService } from "src/client/client.service";
import { Client } from "src/client/entities/client.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { UnregisteredController } from "./unregistered.controller";
import { AuthService } from "src/auth/auth.service";
import { AdminService } from "src/admin/admin.service";
import { Admin } from "src/admin/entities/admin.entity";
import { Device } from "src/device/entities/device.entity";
import { Program } from "src/program/entities/program.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Unregistered, Program, Device, Admin, Client]),
  ],
  providers: [
    UnregisteredService,
    AuthService,
    AdminService,
    ClientService,
    HashPasswordService,
    CleanPromiseService,
  ],
  exports: [UnregisteredService],
  controllers: [UnregisteredController],
})
export class UnregisteredModule {}
