import { CleanPromiseService } from "@CleanPromise/clean-promise";
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientService } from "src/client/client.service";
import { Repository } from "typeorm";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateManyProgramDto } from "./dto/update-many-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { Program } from "./entities/program.entity";

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly clientService: ClientService,
    private readonly CleanPromise: CleanPromiseService
  ) {}
  async GetAll() {
    const [programs, error] = await this.CleanPromise.Do(
      this.programRepository.find()
    );
    if (error) throw new InternalServerErrorException("Couldn't Get Programs");
    if (programs.length == 0)
      throw new NotFoundException("No Programs Were Found");
    return programs;
  }
  async findById(id: string) {
    const [program, error] = await this.CleanPromise.Do(
      this.programRepository.findOne({
        where: {
          id,
        },
      })
    );
    if (error) throw new InternalServerErrorException("Couldn't Get Program");
    if (!program) throw new NotFoundException("No Program Was Found");
    return program;
  }
  async Create(CreateProgramDto: CreateProgramDto) {
    const client = await this.clientService.findByid(
      CreateProgramDto.clientId,
      ["devices"]
    );
    const ValidDevices = CreateProgramDto.deviceIds.every((requestId) =>
      client.devices.some((device) => device.id === requestId)
    );

    if (!ValidDevices)
      throw new BadRequestException(
        "Some Or All Devices Dont Belongs To This Client"
      );
    const devices = client.devices.filter((device) =>
      CreateProgramDto.deviceIds.includes(device.id)
    );

    const programData = this.programRepository.create({
      ...CreateProgramDto,
      client: client,
      devices: devices,
    });

    const [program, error] = await this.CleanPromise.Do(
      this.programRepository.save(programData)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Create The Program");
    return {
      message: "Program Created Successfully",
      statusCode: HttpStatus.CREATED,
    };
  }
  async PatchManyById(UpdateManyProgramDto: UpdateManyProgramDto) {
    const { ids, ...data } = UpdateManyProgramDto;
    const [PatchedPrograms, error] = await this.CleanPromise.Do(
      this.programRepository
        .createQueryBuilder()
        .whereInIds(ids)
        .update(Program)
        .set(data)
        .execute()
    );

    if (error)
      throw new InternalServerErrorException("Couldn't Update Programs");
    if (PatchedPrograms.affected != ids.length)
      throw new NotFoundException("Some or All Programs Were Not Found");
    return {
      message: "Programs Update Successfully",
      statusCode: 200,
    };
  }
  async PatchById(id: string, UpdateProgramDto: UpdateProgramDto) {
    const program = await this.findById(id);

    const client = await this.clientService.findByid(
      UpdateProgramDto.clientId,
      ["devices"]
    );
    const ValidDevices = UpdateProgramDto.deviceIds.every((requestId) =>
      client.devices.some((device) => device.id === requestId)
    );
    if (!ValidDevices)
      throw new BadRequestException(
        "Some Or All Devices Were Not Found For The This Client"
      );
    const devices = client.devices.filter((device) =>
      UpdateProgramDto.deviceIds.includes(device.id)
    );
    program.client = client;
    program.devices = devices;
    const { clientId, deviceIds, ...PatchData } = UpdateProgramDto;
    for (const key in PatchData) {
      if (Object.prototype.hasOwnProperty.call(PatchData, key)) {
        program[key] = PatchData[key];
      }
    }
    const [UpdatedProgram, error] = await this.CleanPromise.Do(
      this.programRepository.save(program)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Create The Program");
    return {
      message: "Program Updated Successfully",
      statusCode: 200,
    };
  }
  async DeleteById(id: string) {
    const [DeletedProgram, error] = await this.CleanPromise.Do(
      this.programRepository.delete(id)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Delete The Program");
    if (!DeletedProgram.affected)
      throw new NotFoundException(
        "No Program Found With The Given Id To Delete, Please Check The Id"
      );

    return {
      Message: "The Program Was Deleted Successfully",
      StatusCode: 204,
    };
  }
  async DeleteManyById(ids: string[]) {
    const [programs, error] = await this.CleanPromise.Do(
      this.programRepository.createQueryBuilder().whereInIds(ids).getMany()
    );
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Verify Programs, Plase Check The Programs Ids"
      );
    if (programs.length !== ids.length)
      throw new NotFoundException("Some Or All Programs Were Not Found");

    const [DeletedPrograms, DeletingError] = await this.CleanPromise.Do(
      this.programRepository.remove([...programs])
    );
    if (DeletingError)
      throw new InternalServerErrorException(
        "Couldn't Delete The Programs, Please Check The Ids"
      );
    if (DeletedPrograms && DeletedPrograms.length === 0)
      throw new NotFoundException(
        "No Program Found With The Given Id To Delete"
      );

    return {
      Message: "The Programs Were Deleted Successfully",
      StatusCode: 204,
    };
  }
}
