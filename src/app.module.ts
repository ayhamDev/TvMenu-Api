import { CleanPromiseModule } from "@CleanPromise/clean-promise";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/entities/admin.entity";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ClientModule } from "./client/client.module";
import { Client } from "./client/entities/client.entity";
import { DeviceModule } from "./device/device.module";
import { Device } from "./device/entities/device.entity";
import { Program } from "./program/entities/program.entity";
import { ProgramModule } from "./program/program.module";
import { Unregistered } from "./unregistered/entities/unregistered.entity";
import { UnregisteredModule } from "./unregistered/unregistered.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: "mssql",
        host: ConfigService.get<string>("DB_HOST"),
        port: 1433,
        username: ConfigService.get<string>("DB_USER"),
        password: ConfigService.get<string>("DB_PASSWORD"),
        database: ConfigService.get<string>("DB"),
        options: {
          encrypt: false,
        },
        logging:
          ConfigService.get<string>("NODE_ENV") != "production" ? true : false,
        synchronize:
          ConfigService.get<string>("NODE_ENV") != "production" ? true : false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("TOKEN_KEY"),
        signOptions: { expiresIn: "3h" },
      }),
      inject: [ConfigService],
    }),
    CleanPromiseModule,
    AdminModule,
    ClientModule,
    DeviceModule,
    ProgramModule,
    UnregisteredModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
