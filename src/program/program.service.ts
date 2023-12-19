import { CleanPromiseService } from "@CleanPromise/clean-promise";
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Program } from "./entities/program.entity";
import { CreateProgramDto } from "./dto/create-program.dto";
import { ClientService } from "src/client/client.service";
import { UpdateProgramDto } from "./dto/update-program.dto";

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
        "Some Or All Devices Were Not Found For The This Client"
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
  async PatchById(id: string, data: CreateProgramDto) {
    const program = await this.findById(id);

    const client = await this.clientService.findByid(data.clientId, [
      "devices",
    ]);
    const ValidDevices = data.deviceIds.every((requestId) =>
      client.devices.some((device) => device.id === requestId)
    );
    if (!ValidDevices)
      throw new BadRequestException(
        "Some Or All Devices Were Not Found For The This Client"
      );
    const devices = client.devices.filter((device) =>
      data.deviceIds.includes(device.id)
    );
    program.client = client;
    program.devices = devices;

    program.name = data.name;
    program.description = data.description;
    program.duration = data.duration;
    program.nextLoop = data.nextLoop;
    program.endDateTime = data.endDateTime;
    program.startDateTime = data.startDateTime;
    program.enterAnimation = data.enterAnimation;
    program.leaveAnimation = data.leaveAnimation;
    program.width = data.width;
    program.height = data.height;
    program.x = data.x;
    program.y = data.y;
    program.type = data.type;
    program.status = data.status;
    program.videoUrl = data.videoUrl;
    program.webUrl = data.webUrl;
    program.imageUrl = data.imageUrl;
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
    console.log(ids);

    const [DeletedPrograms, error] = await this.CleanPromise.Do(
      this.programRepository.delete([...ids])
    );
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Delete The Programs, Please Check The Ids"
      );
    if (!DeletedPrograms.affected)
      throw new NotFoundException(
        "No Program Found With The Given Id To Delete"
      );

    return {
      Message: "The Programs Were Deleted Successfully",
      StatusCode: 204,
    };
  }
}
