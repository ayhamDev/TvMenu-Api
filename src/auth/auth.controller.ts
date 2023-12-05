import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AdminDto } from "src/admin/dto/admin.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { log } from "console";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthSerivce: AuthService) {}

  @Post("admin")
  AdminLogin(@Body() adminDto: AdminDto) {
    return this.AuthSerivce.AdminLogin(adminDto);
  }

  @UseGuards(AuthGuard("local"))
  @Post("key")
  keys(@Request() req) {
    console.log(req.user);

    return req.user;
  }
}
