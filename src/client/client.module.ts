import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { AuthService } from "src/auth/auth.service";
import { AdminService } from "src/admin/admin.service";
import { AdminModule } from "src/admin/admin.module";
import { Admin } from "src/admin/entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Client, Admin])],
  controllers: [ClientController],
  providers: [
    ClientService,
    AuthService,
    AdminService,
    CleanPromiseService,
    HashPasswordService,
  ],
  exports: [ClientService],
})
export class ClientModule {}
