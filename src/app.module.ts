import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/entities/admin.entity";
import { ClientModule } from "./client/client.module";
import { Client } from "./client/entities/client.entity";
import { DeviceModule } from "./device/device.module";
import { Device } from "./device/entities/device.entity";
import { ProgramModule } from "./program/program.module";
import { Program } from "./program/entities/program.entity";
import { UnregisteredModule } from "./unregistered/unregistered.module";
import { Unregistered } from "./unregistered/entities/unregistered.entity";
import { CleanPromiseModule } from "@CleanPromise/clean-promise";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

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
        entities: [Admin, Client, Device, Program, Unregistered],
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
