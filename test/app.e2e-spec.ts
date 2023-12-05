import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Welcome To Menuone Api.");
  });
  it("/admin/register (POST)", () => {
    return request(app.getHttpServer())
      .post("/admin/register")
      .expect(409)
      .expect({
        message: "Admin With This Email Already Exists",
        error: "Conflict",
        statusCode: 409,
      });
  });
  it("/auth/admin (POST)", () => {
    return request(app.getHttpServer()).get("/").expect(409).expect({
      message: "Admin With This Email Already Exists",
      error: "Conflict",
      statusCode: 409,
    });
  });
});
