import { CleanPromiseService } from "@CleanPromise/clean-promise";
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { AuthDto } from "src/auth/dto/auth.dto";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { EntityNotFoundError, Repository, In, DataSource } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client } from "./entities/client.entity";
import { DeviceService } from "src/device/device.service";
import { Device } from "src/device/entities/device.entity";
import { Program } from "src/program/entities/program.entity";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private ClientRepository: Repository<Client>,
    @InjectRepository(Device) private DeviceRepository: Repository<Device>,
    @InjectRepository(Program) private ProgramRepository: Repository<Program>,

    private readonly CleanPromise: CleanPromiseService,
    private readonly HashPassword: HashPasswordService,
    private readonly DataSource: DataSource
  ) {}

  async Register(ClientDto: CreateClientDto) {
    const { password, ...ClientData } = ClientDto;

    const HashedPassword = await this.HashPassword.Do(password);

    const NewClient = this.ClientRepository.create({
      ...ClientData,
      password: HashedPassword,
    });

    const [RegisteredClient, error] = await this.CleanPromise.Do(
      this.ClientRepository.save(NewClient)
    );

    if (error)
      throw new ConflictException("Client With This Email Already Exists");
    const {
      password: RegisteredClientHashedPassword,
      ...RegisteredClientData
    } = RegisteredClient;

    return {
      message: "Client Created Successfully",
      statusCode: HttpStatus.CREATED,
      data: RegisteredClientData,
    };
  }
  async ValidateCredentials(authDto: AuthDto) {
    const [client, error] = await this.CleanPromise.Do(
      this.ClientRepository.findOne({
        where: {
          email: authDto.email,
        },
      })
    );
    if (error) throw new InternalServerErrorException("Couldn't Find Client");
    if (!client) return null;

    const [PasswordValid, CompareError] = await this.CleanPromise.Do(
      bcrypt.compare(authDto.password, client.password)
    );
    if (CompareError)
      throw new InternalServerErrorException("Couldn't Verify Password");
    if (!PasswordValid) return null;
    const { password, ...clientData } = client;
    return clientData;
  }
  async GetAll() {
    const [clients, error] = await this.CleanPromise.Do(
      this.ClientRepository.find({
        select: {
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
      })
    );
    if (error instanceof EntityNotFoundError)
      throw new NotFoundException("No Clients Found");
    if (error) throw new InternalServerErrorException("Couldn't Get Clients");
    if (clients.length == 0)
      throw new NotFoundException("No Clients Were Found");
    return clients;
  }
  async findByid(id: string, join?: string[]) {
    if (!id) throw new BadRequestException("Missing Parameter id");

    const [client, error] = await this.CleanPromise.Do(
      this.ClientRepository.findOne({
        relations: join || undefined,
        select: {
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
        where: {
          id,
        },
      })
    );
    if (error)
      throw new InternalServerErrorException(
        "Couldn't Get The Client, Please Check The Client Id"
      );
    if (!client)
      throw new NotFoundException("No Client Found With The Given Id");
    return client;
  }
  async PatchData(id: string, UpdateClientDto: UpdateClientDto) {
    const client = await this.findByid(id);
    for (const key in UpdateClientDto) {
      if (Object.prototype.hasOwnProperty.call(UpdateClientDto, key)) {
        client[key] = UpdateClientDto[key];
      }
    }
    const [PatchedClient, error] = await this.CleanPromise.Do(
      this.ClientRepository.save(client)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Save Client Data");
    const { password, ...PatchedClientData } = PatchedClient;
    return {
      message: "Client Updated Successfully",
      StatusCode: 200,
      data: PatchedClientData,
    };
  }
  async PatchPassword(id: string, password: string) {
    const client = await this.findByid(id);
    const HashedPassword = await this.HashPassword.Do(password);
    client.password = HashedPassword;
    const [PatchedClient, error] = await this.CleanPromise.Do(
      this.ClientRepository.save(client)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Patch Password");
    return {
      message: "Password Updated Successfully",
      StatusCode: 200,
    };
  }
  async DeleteManyClients(ids: string[]) {
    console.log(ids.length);

    const [clients, ClientErrors] = await this.CleanPromise.Do(
      this.ClientRepository.createQueryBuilder().whereInIds(ids).getMany()
    );

    if (ClientErrors)
      throw new InternalServerErrorException(
        "Couldn't Verify Clients, Plase Check The Client Ids"
      );
    if (clients.length !== ids.length)
      throw new NotFoundException("Some Or All Client Were Not Found");

    const [DeletedClients, error] = await this.CleanPromise.Do(
      this.ClientRepository.remove([...clients])
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Delete the Clients");
    if (DeletedClients.length == 0)
      throw new NotFoundException(
        " No Clients Found With The Given Ids To Delete"
      );
    return {
      Message: "The Clients Were Deleted Successfully",
      StatusCode: 204,
    };
  }
  async DeleteClient(id: string) {
    const client = await this.findByid(id);
    const QueryRunner = this.DataSource.createQueryRunner();
    await QueryRunner.connect();
    await QueryRunner.startTransaction();
    try {
      const devices = await QueryRunner.manager.find(Device, {
        where: {
          clientId: id,
        },
      });
      const programs = await QueryRunner.manager.find(Program, {
        where: {
          clientId: id,
        },
      });

      await QueryRunner.manager.remove(devices);
      await QueryRunner.manager.remove(programs);
      await QueryRunner.manager.remove(client);
      await QueryRunner.commitTransaction();
      return {
        message: "Client Was Deleted Successfull",
        statusCode: 201,
      };
    } catch (err) {
      console.log(err);

      await QueryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Couldn't Delete The Client");
    } finally {
      QueryRunner.release();
    }
    // const [DeletedClient, error] = await this.CleanPromise.Do(
    //   this.ClientRepository.remove(client)
    // );
    // if (error)
    //   throw new InternalServerErrorException("Couldn't Delete the Clients");
    // if (!DeletedClient)
    //   throw new NotFoundException(
    //     "No Client Found With The Given Id To Delete"
    //   );

    // return {
    //   Message: "The Client Was Deleted Successfully",
    //   StatusCode: 204,
    //   data: DeletedClient,
    // };
  }
}
