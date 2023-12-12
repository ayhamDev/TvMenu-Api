import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { User } from "src/auth/user/user.decorator";
import { UnregisteredService } from "./unregistered.service";

@Controller("unregistered")
@UseGuards(AuthGuard)
export class UnregisteredController {
  constructor(private readonly UnregisteredService: UnregisteredService) {}
  @Get()
  @Role("Admin")
  async Admin__GetAllUnRegisteredDevice() {
    return this.UnregisteredService.GetAll();
  }
  @Get()
  @Role("Client")
  async Client__GetAllUnRegisteredDevice(@User() user: any) {
    return this.UnregisteredService.GetAll(user.id);
  }
  @Get(":id")
  @Role("Admin")
  async Admin__FindUnRegisteredDeviceById(@Param("id") id: string) {
    return this.UnregisteredService.findById(id);
  }
  @Get(":id")
  @Role("Client")
  async Client__FindUnRegisteredDeviceById(
    @Param("id") id: string,
    @User() user: any
  ) {
    return this.UnregisteredService.findById(id, user.id);
  }
}
