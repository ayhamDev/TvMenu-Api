import * as bcrypt from "bcrypt";

import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  ConflictException,
  HttpStatus,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";
import { CleanPromiseService } from "@CleanPromise/clean-promise";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly CleanPromise: CleanPromiseService
  ) {}
  @Post("register")
  async Register(@Body() adminDto: AdminDto) {
    return await this.adminService.Register(adminDto);
  }
}
