import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AdminModule } from "src/admin/admin.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { HashPasswordService } from "./hash-password/hash-password.service";
import { ClientModule } from "src/client/client.module";
import { ClientService } from "src/client/client.service";

@Module({
  imports: [PassportModule, AdminModule, ClientModule],
  providers: [AuthService, AuthGuard, CleanPromiseService, HashPasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
