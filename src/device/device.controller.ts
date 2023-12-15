import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { DeviceService } from "./device.service";

@Controller("device")
@UseGuards(AuthGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
}
