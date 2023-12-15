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

@Injectable()
export class UnregisteredService {
  constructor(
    private readonly CleanPromise: CleanPromiseService,
    @InjectRepository(Unregistered)
    private readonly UnregisteredRepository: Repository<Unregistered>,
    @InjectRepository(Client)
    private readonly ClientRepository: Repository<Client>
  ) {}
  async GetAll(ClientId?: string) {
    const ClientQuary: FindManyOptions<Unregistered> = ClientId
      ? {
          where: {
            client: {
              id: ClientId,
            },
          },
          select: {
            client: {
              id: true,
              email: true,
              password: false,
              storeName: true,
              country: true,
              state: true,
              city: true,
              address: true,
              zipCode: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          relations: ["client"],
        }
      : {
          select: {
            client: {
              id: true,
              email: true,
              password: false,
              storeName: true,
              country: true,
              state: true,
              city: true,
              address: true,
              zipCode: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          relations: ["client"],
        };
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
        select: {
          client: {
            id: true,
            email: true,
            password: false,
            storeName: true,
            country: true,
            state: true,
            city: true,
            address: true,
            zipCode: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        relations: ["client"],
      })
    );
    if (error)
      throw new InternalServerErrorException("The Given Id is Not Valid");
    if (!UnRegisteredDevice)
      throw new NotFoundException("No UnRegistered Device Was Found");
    if (clientId && UnRegisteredDevice.client.id !== clientId)
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
          id: addDeviceDto.id,
        },
      })
    );
    if (error instanceof EntityNotFoundError)
      throw new NotFoundException("No Client Found With The Requested Id");
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Verify The Client, Plase Check Client Id"
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
      messsage: "Device Added Or Updated Successfully",
      statusCode: 200,
      data: reset,
    };
  }
}
