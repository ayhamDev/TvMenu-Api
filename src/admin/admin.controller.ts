import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";
import { AdminDtoPartialType } from "./dto/admin-PartialType.dto";
import { AdminPatchPasswordDto } from "./dto/adminPatchPassword.dto";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post("register")
  @Role("Admin")
  async Register(@Body() adminDto: AdminDto) {
    return await this.AdminService.Register(adminDto);
  }

  @Get()
  @Role("Admin")
  GetAllAdmins() {
    return this.AdminService.GetAll();
  }

  @Get(":id")
  @Role("Admin")
  GetAdminById(@Param("id") id: string) {
    return this.AdminService.findById(id);
  }

  @Patch(":id")
  @Role("Admin")
  PatchAdminPassword(
    @Param("id") id: string,
    @Body() adminPatchPassword: AdminPatchPasswordDto
  ) {
    return this.AdminService.PatchPassword(id, adminPatchPassword.password);
  }

  @Delete(":id")
  @Role("Admin")
  DeleteAdmin(@Param("id") id: string) {}
}
