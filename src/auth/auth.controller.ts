import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AdminDto } from "src/admin/dto/admin.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthSerivce: AuthService) {}

  @Post("admin")
  AdminLogin(@Body() adminDto: AdminDto) {
    return this.AuthSerivce.AdminLogin(adminDto);
  }
}
