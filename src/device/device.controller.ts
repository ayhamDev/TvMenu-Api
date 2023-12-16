import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { DeviceService } from "./device.service";
import { Role } from "src/auth/role/role.decorator";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { DeviceDeleteManyDto } from "./dto/device-deletemany.dto";
import { UpdateDeviceDto, UpdateManyDevicesDto } from "./dto/update-device.dto";

@Controller("device")
@UseGuards(AuthGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @Role("Admin")
  GetAllDevices() {
    return this.deviceService.GetAll();
  }
  @Get("/:id")
  @Role("Admin")
  findDeviceById(@Param("id") id: string) {
    return this.deviceService.findById(id);
  }

  @Post()
  @Role("Admin")
  RegisterDevice(@Body() CreateDeviceDto: CreateDeviceDto) {
    return this.deviceService.Register(CreateDeviceDto);
  }
  @Patch("/bulk")
  @Role("Admin")
  PatchDevicesById(@Body() UpdateManyDevicesDto: UpdateManyDevicesDto) {
    return this.deviceService.PatchManyDataById(UpdateManyDevicesDto);
  }
  @Patch("/:id")
  @Role("Admin")
  PatchDeviceDataById(
    @Param("id") id: string,
    @Body() UpdateDeviceDto: UpdateDeviceDto
  ) {
    return this.deviceService.PatchDataById(id, UpdateDeviceDto);
  }

  @Delete("/bulk")
  @Role("Admin")
  DeleteManyDeviceById(@Body() DeviceDeleteManyDto: DeviceDeleteManyDto) {
    return this.deviceService.DeleteManyById(DeviceDeleteManyDto.ids);
  }

  @Delete("/:id")
  @Role("Admin")
  DeleteDeviceById(@Param("id") id: string) {
    return this.deviceService.DeleteById(id);
  }
}
