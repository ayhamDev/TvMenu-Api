import { CleanPromiseService } from "@CleanPromise/clean-promise";
import {
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
    if (!program) throw new NotFoundException("No Program Were Found");
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

    if (ValidDevices) {
      console.log(ValidDevices);
    } else {
      console.log("not Valid");
      return false;
    }

    const devices = client.devices.filter((device) =>
      CreateProgramDto.deviceIds.includes(device.id)
    );

    const programData = this.programRepository.create({
      ...CreateProgramDto,
      client: client,
      devices: devices,
    });
    console.log(programData);

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
}
