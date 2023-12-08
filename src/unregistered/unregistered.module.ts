import { Module } from "@nestjs/common";
import { UnregisteredService } from "./unregistered.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unregistered } from "./entities/unregistered.entity";
import { ClientService } from "src/client/client.service";
import { Client } from "src/client/entities/client.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";

@Module({
  imports: [TypeOrmModule.forFeature([Unregistered, Client])],
  providers: [UnregisteredService, CleanPromiseService],
  exports: [UnregisteredService],
})
export class UnregisteredModule {}
