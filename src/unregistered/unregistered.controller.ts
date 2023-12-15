import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { User } from "src/auth/user/user.decorator";
import { UnregisteredService } from "./unregistered.service";
import { AddUnregisteredDeviceDto } from "./dto/device-add-unregistered.dto";
import { UpdateUnregisteredDeviceDto } from "./dto/device-update-unregistered.dto";

@Controller("unregistered")
@UseGuards(AuthGuard)
export class UnregisteredController {
  constructor(private readonly UnregisteredService: UnregisteredService) {}

  @Post()
  @Role("Admin")
  AddDevice(@Body() AddUnregisteredDeviceDto: AddUnregisteredDeviceDto) {
    return this.UnregisteredService.addDevice(AddUnregisteredDeviceDto);
  }
  @Patch("/:id")
  @Role("Admin")
  PatchDevice(
    @Param("id") id: string,
    @Body() UpdateUnregisteredDeviceDto: UpdateUnregisteredDeviceDto
  ) {
    return this.UnregisteredService.PatchDevice(
      id,
      UpdateUnregisteredDeviceDto
    );
  }

  @Get()
  @Role("Admin", "Client")
  GetAllUnRegisteredDevice(@User() user: any) {
    if (user.Role === "Admin") return this.UnregisteredService.GetAll();
    return this.UnregisteredService.GetAll(user.id);
  }

  @Get(":id")
  @Role("Admin", "Client")
  FindUnRegisteredDeviceById(@Param("id") id: string, @User() user: any) {
    if (user.Role === "Admin") return this.UnregisteredService.findById(id);
    return this.UnregisteredService.findById(id, user.id);
  }
}
