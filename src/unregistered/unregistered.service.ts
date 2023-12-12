import {
  BadRequestException,
  ForbiddenException,
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
    private readonly CleanPromise: CleanPromiseService,
    @InjectRepository(Unregistered)
    private readonly UnregisteredRepository: Repository<Unregistered>,
    @InjectRepository(Client)
    private readonly ClientRepository: Repository<Client>
  ) {}
  async GetAll(ClientID?: string) {
    const ClientQuary = ClientID
      ? {
          client: {
            id: ClientID,
          },
        }
      : undefined;
    const [devices, error] = await this.CleanPromise.Do(
      this.UnregisteredRepository.findBy(ClientQuary)
    );
    if (!devices || error)
      throw new InternalServerErrorException(
        "Couldn't Get UnRegistered Devices"
      );
    if (devices && devices.length == 0)
      throw new NotFoundException("No UnRegistered Devices Were Found");
    return devices;
  }
  async findById(id: string, clientID?: string) {
    if (!id) throw new BadRequestException("Missing Parameter id");
    const [device, error] = await this.CleanPromise.Do(
      this.UnregisteredRepository.findOne({
        where: {
          id,
        },
        relations: ["client"],
      })
    );
    if (error)
      throw new InternalServerErrorException("The Given Id is Not Valid");
    if (!device) throw new NotFoundException("No Device Was Found");
    if (device.client.id !== clientID)
      throw new ForbiddenException(
        "This UnRegistered Device Belongs To Other Client"
      );
    return device;
  }
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
    const unregisteredDevice = this.UnregisteredRepository.create({
      id: addDevice.id,
      ipAddress: addDevice.ipAddress,
      client,
    });
    const [unregisteredDeviceData, SaveError] = await this.CleanPromise.Do(
      this.UnregisteredRepository.save(unregisteredDevice)
    );
    if (SaveError)
      throw new InternalServerErrorException("Couldn't Save The Device");

    return unregisteredDeviceData;
  }
}
