import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin/admin.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    })
  );
  app.enableCors();
  const Admin = app.get(AdminService);
  await app.listen(3000);
  await Admin.DefualtAdmin();
}
bootstrap();
