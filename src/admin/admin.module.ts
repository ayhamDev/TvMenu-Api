import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/auth/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, AuthService, CleanPromiseService],
  exports: [AdminService],
})
export class AdminModule {}
