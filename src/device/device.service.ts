import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Device } from "./entities/device.entity";
import { Repository } from "typeorm";
import { CleanPromiseService } from "@CleanPromise/clean-promise";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly DeviceRepository: Repository<Device>,
    private readonly CleanPromise: CleanPromiseService
  ) {}

  async GetAll() {
    const [Devices, Error] = await this.CleanPromise.Do(
      this.DeviceRepository.find()
    );
    if (Error) throw new InternalServerErrorException("Couldn't Get Devices");
    if (Devices.length == 0)
      throw new NotFoundException("No Devices Were Found");
    return Devices[0];
  }
}
