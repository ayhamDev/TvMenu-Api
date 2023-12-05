import * as bcrypt from "bcrypt";

import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post("register")
  async Register(@Body() adminDto: AdminDto, @Request() req: any) {
    if (req.user.Role != "Admin") throw new UnauthorizedException();
    return await this.adminService.Register(adminDto);
  }
}
