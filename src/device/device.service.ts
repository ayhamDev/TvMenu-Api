import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Device } from "./entities/device.entity";
import { DataSource, Repository, Transaction } from "typeorm";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UnregisteredService } from "src/unregistered/unregistered.service";
import { Unregistered } from "src/unregistered/entities/unregistered.entity";
import { UpdateDeviceDto, UpdateManyDevicesDto } from "./dto/update-device.dto";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly DeviceRepository: Repository<Device>,
    private readonly UnRegisteredService: UnregisteredService,
    private readonly CleanPromise: CleanPromiseService,
    private readonly DataSource: DataSource
  ) {}

  async GetAll() {
    const [Devices, Error] = await this.CleanPromise.Do(
      this.DeviceRepository.find()
    );
    if (Error) throw new InternalServerErrorException("Couldn't Get Devices");
    if (Devices.length == 0)
      throw new NotFoundException("No Devices Were Found");
    return Devices;
  }
  async findById(id: string) {
    const [Device, Error] = await this.CleanPromise.Do(
      this.DeviceRepository.findOne({
        where: {
          id,
        },
      })
    );
    if (Error) throw new InternalServerErrorException("Couldn't Get Device");
    if (!Device) throw new NotFoundException("No Device Was Found");
    return Device;
  }
  async Register(DeviceDto: CreateDeviceDto) {
    const [DeviceExists, error] = await this.CleanPromise.Do(
      this.DeviceRepository.findOneBy({
        id: DeviceDto.id,
      })
    );

    if (error)
      throw new InternalServerErrorException("Couldn't Verify The Device");
    if (DeviceExists) throw new ConflictException("Device Already Registered");

    const UnRegisteredDevice = await this.UnRegisteredService.findById(
      DeviceDto.id
    );

    const QueryRunner = this.DataSource.createQueryRunner();
    await QueryRunner.connect();
    await QueryRunner.startTransaction();
    try {
      const device = this.DeviceRepository.create({
        id: UnRegisteredDevice.id,
        clientId: UnRegisteredDevice.clientId,
        name: DeviceDto.name,
        description: DeviceDto.description,
      });
      await QueryRunner.manager.save(device);
      await QueryRunner.manager.remove(UnRegisteredDevice);
      await QueryRunner.commitTransaction();
      return {
        message: "Device Registration Was Successfull",
        statusCode: 201,
        data: device,
      };
    } catch (err) {
      await QueryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Couldn't Register The Device");
    } finally {
      await QueryRunner.release();
    }
  }
  async PatchManyDataById(data: UpdateManyDevicesDto) {
    const { ids, ...PatchData } = data;
    const [PatchedDevice, error] = await this.CleanPromise.Do(
      this.DeviceRepository.createQueryBuilder()
        .update(Device)
        .set(PatchData)
        .whereInIds(ids)
        .execute()
    );

    if (error)
      throw new InternalServerErrorException("Couldn't Update The Device");
    if (PatchedDevice && !PatchedDevice.affected)
      throw new NotFoundException(
        "No Device Found With The Given Id To Update"
      );
    return {
      message: "The Devices Were Updated Successfully",
      statusCode: 200,
    };
  }
  async PatchDataById(id: string, data: UpdateDeviceDto) {
    const [PatchedDevice, error] = await this.CleanPromise.Do(
      this.DeviceRepository.update(id, {
        ...data,
      })
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Update The Device");
    if (PatchedDevice && !PatchedDevice.affected)
      throw new NotFoundException(
        "No Device Found With The Given Id To Update"
      );
    return {
      message: "The Device Was Updated Successfully",
      statusCode: 200,
    };
  }
  async DeleteManyById(ids: string[]) {
    const [devices, error] = await this.CleanPromise.Do(
      this.DeviceRepository.createQueryBuilder().whereInIds(ids).getMany()
    );
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Verify Devices, Plase Check The Client Ids"
      );
    if (devices.length !== ids.length)
      throw new NotFoundException("Some Or All Devices Were Not Found");
    const [DeletedDevices, DeletingError] = await this.CleanPromise.Do(
      this.DeviceRepository.remove([...devices])
    );
    if (DeletingError)
      throw new InternalServerErrorException("Couldn't Delete The Devices");
    if (DeletedDevices && DeletedDevices.length == 0)
      throw new NotFoundException(
        "No Device Found With The Given Ids To Delete"
      );
    return {
      Message: "Devices Were Deleted Successfully",
      StatusCode: 204,
    };
  }
  async DeleteById(id: string) {
    const [DeletedDevice, error] = await this.CleanPromise.Do(
      this.DeviceRepository.delete(id)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't delete The Device");
    if (DeletedDevice && !DeletedDevice.affected)
      throw new NotFoundException(
        "No Device Found With The Given Id To Delete"
      );
    return {
      Message: "Device Was Deleted Successfully",
      StatusCode: 204,
    };
  }
}
