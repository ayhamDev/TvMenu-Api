import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { DeepPartial, EntityNotFoundError, Repository } from "typeorm";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";
import { CreateClientDto } from "./dto/create-client.dto";
import * as bcrypt from "bcrypt";
import { UpdateClientDto } from "./dto/update-client.dto";
import { AuthDto } from "src/auth/dto/auth.dto";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private ClientRepository: Repository<Client>,
    private readonly CleanPromise: CleanPromiseService,
    private readonly HashPassword: HashPasswordService
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
    if (error) throw new InternalServerErrorException();
    return clients;
  }
  async findByid(id: string) {
    if (!id) throw new BadRequestException("Missing Parameter id");

    const [client, error] = await this.CleanPromise.Do(
      this.ClientRepository.findOne({
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
        "The Given Id is Not Of The Type Uniqueidentifier"
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
    const [DeletedClients, error] = await this.CleanPromise.Do(
      this.ClientRepository.delete([...ids])
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Delete the Clients");
    if (DeletedClients && !DeletedClients.affected)
      throw new NotFoundException(
        " No Clients Found With The Given Ids To Delete"
      );
    return {
      Message: "Clients Deleted Successfully",
      StatusCode: 204,
    };
  }
  async DeleteClient(id: string) {
    const [DeletedClient, error] = await this.CleanPromise.Do(
      this.ClientRepository.delete(id)
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Delete the Clients");
    if (DeletedClient && !DeletedClient.affected)
      throw new NotFoundException(
        "No Client Found With The Given Id To Delete"
      );

    return {
      Message: "Client Deleted Successfully",
      StatusCode: 204,
    };
  }
}
