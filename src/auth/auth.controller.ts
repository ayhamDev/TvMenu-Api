import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AdminDto } from "src/admin/dto/admin.dto";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthSerivce: AuthService) {}

  @Post("admin")
  AdminLogin(@Body() AuthDto: AuthDto) {
    return this.AuthSerivce.AdminLogin(AuthDto);
  }
  @Post("client")
  ClientLogin(@Body() AuthDto: AuthDto) {
    return this.AuthSerivce.ClientLogin(AuthDto);
  }
}
