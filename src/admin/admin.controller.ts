import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("register")
  @Role("Admin")
  async Register(@Body() adminDto: AdminDto) {
    return await this.adminService.Register(adminDto);
  }
}
