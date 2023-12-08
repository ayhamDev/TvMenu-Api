import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unregistered } from "./entities/unregistered.entity";
import { Repository } from "typeorm";
import { AddUnregisteredDeviceDto } from "./dto/device-add-unregistered.dto";
import { Client } from "src/client/entities/client.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";

@Injectable()
export class UnregisteredService {
  constructor(
    @InjectRepository(Unregistered)
    private readonly UnregisteredRepository: Repository<Unregistered>,
    @InjectRepository(Client)
    private readonly ClientRepository: Repository<Client>,
    private readonly CleanPromise: CleanPromiseService
  ) {}
  async addDevice(addDevice: AddUnregisteredDeviceDto) {
    const [client, error] = await this.CleanPromise.Do(
      this.ClientRepository.findOne({
        where: {
          id: addDevice.clientId,
        },
      })
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Look for Client");
    if (!client)
      throw new NotFoundException("No Client Found With The Requested Id");
    this.UnregisteredRepository.create({
      id: addDevice.id,
      ipAddress: addDevice.ipAddress,
      client,
    });
  }
}
