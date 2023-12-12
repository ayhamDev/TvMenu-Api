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

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Client])],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    AuthService,
    AdminService,
    ClientService,
    HashPasswordService,
    CleanPromiseService,
  ],
})
export class DeviceModule {}
