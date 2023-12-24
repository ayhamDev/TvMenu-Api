import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { AuthService } from "src/auth/auth.service";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { ClientModule } from "src/client/client.module";
import { ClientService } from "src/client/client.service";
import { Client } from "src/client/entities/client.entity";
import { Device } from "src/device/entities/device.entity";
import { Program } from "src/program/entities/program.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Device, Program, Client])],
  controllers: [AdminController],
  providers: [
    AdminService,
    AuthService,
    ClientService,
    HashPasswordService,
    CleanPromiseService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
