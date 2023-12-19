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
import { AdminDeleteManyDto } from "./dto/admin-DeleteMany.dto";
import { PatchPasswordDto } from "src/auth/dto/PatchPassword.dto";
import { uuidDto } from "src/dto/UUID.dto";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post("register")
  @Role("Admin")
  async RegisterAdmin(@Body() adminDto: AdminDto) {
    return await this.AdminService.Register(adminDto);
  }

  @Get()
  @Role("Admin")
  GetAllAdmins() {
    return this.AdminService.GetAll();
  }

  @Get(":id")
  @Role("Admin")
  GetAdminById(@Param() params: uuidDto) {
    return this.AdminService.findById(params.id);
  }

  @Patch(":id")
  @Role("Admin")
  PatchAdminPassword(
    @Param() params: uuidDto,
    @Body() PatchPasswordDto: PatchPasswordDto
  ) {
    return this.AdminService.PatchPassword(
      params.id,
      PatchPasswordDto.password
    );
  }
  @Delete("bulk")
  @Role("Admin")
  DeleteManyAdmins(@Body() AdminDeleteManyDto: AdminDeleteManyDto) {
    return this.AdminService.DeleteManyAdmins(AdminDeleteManyDto.ids);
  }
  @Delete(":id")
  @Role("Admin")
  DeleteAdmin(@Param() params: uuidDto) {
    return this.AdminService.DeleteAdmin(params.id);
  }
}
