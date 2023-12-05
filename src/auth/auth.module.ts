import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AdminModule } from "src/admin/admin.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [PassportModule, AdminModule],
  providers: [AuthService, AuthGuard, CleanPromiseService],
  controllers: [AuthController],
})
export class AuthModule {}
