import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/entities/admin.entity";
import { ClientModule } from "./client/client.module";
import { Client } from "./client/entities/client.entity";
import { DeviceModule } from "./device/device.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mssql",
      host: process.env.DB_HOST,
      port: 1433,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      options: {
        encrypt: false,
      },
      logging: process.env.NODE_ENV != "production" ? true : false,
      synchronize: process.env.NODE_ENV != "production" ? true : false,
      entities: [Admin, Client],
    }),
    AdminModule,
    ClientModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
