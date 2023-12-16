import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unregistered } from "./entities/unregistered.entity";
import { EntityNotFoundError, FindManyOptions, Repository } from "typeorm";
import { AddUnregisteredDeviceDto } from "./dto/device-add-unregistered.dto";
import { Client } from "src/client/entities/client.entity";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { UpdateUnregisteredDeviceDto } from "./dto/device-update-unregistered.dto";
import { Device } from "src/device/entities/device.entity";

@Injectable()
export class UnregisteredService {
  constructor(
    @InjectRepository(Device)
    private readonly DeviceRepository: Repository<Device>,
    @InjectRepository(Unregistered)
    private readonly UnregisteredRepository: Repository<Unregistered>,
    @InjectRepository(Client)
    private readonly ClientRepository: Repository<Client>,
    private readonly CleanPromise: CleanPromiseService
  ) {}
  async GetAll(clientId?: string) {
    const ClientQuary: FindManyOptions<Unregistered> = clientId
      ? {
          where: {
            clientId: clientId,
          },
        }
      : {};
    const [devices, error] = await this.CleanPromise.Do(
      this.UnregisteredRepository.find(ClientQuary)
    );
    if (!devices || error)
      throw new InternalServerErrorException(
        "Couldn't Get UnRegistered Devices"
      );
    if (devices && devices.length == 0)
      throw new NotFoundException("No UnRegistered Devices Were Found");
    return devices;
  }
  async findById(id: string, clientId?: string) {
    if (!id) throw new BadRequestException("Missing Parameter id");
    console.log(id);
    const [UnRegisteredDevice, error] = await this.CleanPromise.Do(
      this.UnregisteredRepository.findOne({
        where: {
          id,
        },
      })
    );
    if (error)
      throw new InternalServerErrorException("The Given Id is Not Valid");
    if (!UnRegisteredDevice)
      throw new NotFoundException("No UnRegistered Device Was Found");
    if (clientId && UnRegisteredDevice.clientId !== clientId)
      throw new ForbiddenException(
        "This UnRegistered Device Belongs To Other Client"
      );

    return UnRegisteredDevice;
  }
  async PatchDevice(id: string, PatchDataDto: UpdateUnregisteredDeviceDto) {
    const UnRegisteredDevice = await this.findById(id);
    UnRegisteredDevice.ipAddress = PatchDataDto.ipAddress;
    UnRegisteredDevice.UpdatedCount++;
    const [PatchedData, PatchError] = await this.CleanPromise.Do(
      this.UnregisteredRepository.save(UnRegisteredDevice)
    );
    if (PatchError)
      throw new InternalServerErrorException(
        "Couldn't Update The UnRegistered Device"
      );
    return {
      message: "UnRegistered Device Updated Successfully",
      statusCode: 200,
      data: PatchedData,
    };
  }
  async addDevice(addDeviceDto: AddUnregisteredDeviceDto) {
    const [DeviceExists, DeviceExistsError] = await this.CleanPromise.Do(
      this.DeviceRepository.findOneBy({
        id: addDeviceDto.id,
      })
    );
    if (DeviceExistsError)
      throw new InternalServerErrorException("Couldn't Verify The Device");

    if (DeviceExists) throw new ConflictException("Device Already Registered");

    const [UnregisteredDeviceExists, UnregisteredDeviceExistsError] =
      await this.CleanPromise.Do(
        this.UnregisteredRepository.findOneBy({
          id: addDeviceDto.id,
        })
      );
    if (UnregisteredDeviceExistsError)
      throw new InternalServerErrorException(
        "Couldn't Verify UnRegistered Device"
      );
    if (UnregisteredDeviceExists)
      throw new ConflictException("UnRegistered Device Already Exists");

    const [client, error] = await this.CleanPromise.Do(
      this.ClientRepository.findOne({
        where: {
          id: addDeviceDto.clientId,
        },
      })
    );
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Find Or Verify The Client, Plase Check The Client Id"
      );
    if (!client)
      throw new NotFoundException("No Client Found With The Requested Id");

    const unregisteredDevice = this.UnregisteredRepository.create({
      id: addDeviceDto.id,
      ipAddress: addDeviceDto.ipAddress,
      client,
    });
    const [unregisteredDeviceData, SaveError] = await this.CleanPromise.Do(
      this.UnregisteredRepository.save(unregisteredDevice)
    );
    if (SaveError)
      throw new InternalServerErrorException(
        "Couldn't Save The UnRegistered Device"
      );
    const { client: ClientData, ...reset } = unregisteredDeviceData;
    return {
      messsage: "Device Added Successfully, it needs To be Registered",
      statusCode: 200,
      data: reset,
    };
  }
}
