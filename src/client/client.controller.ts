import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { PatchPasswordDto } from "src/auth/dto/PatchPassword.dto";
import { Role } from "src/auth/role/role.decorator";
import { User } from "src/auth/user/user.decorator";
import { ClientService } from "./client.service";
import { ClientDeleteManyDto } from "./dto/client-deletemany.dto";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller("client")
@UseGuards(AuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post("register")
  @Role("Admin")
  Register(@Body() ClientDto: CreateClientDto) {
    return this.clientService.Register(ClientDto);
  }

  @Get()
  @Role("Admin")
  GetAllClients() {
    return this.clientService.GetAll();
  }

  @Get(":id")
  @Role("Admin")
  GetClientById(@Param("id") id: string) {
    return this.clientService.findByid(id);
  }

  @Patch(":id")
  @Role("Admin")
  PatchClientData(
    @Param("id") id: string,
    @Body() UpdateClientDto: UpdateClientDto
  ) {
    return this.clientService.PatchData(id, UpdateClientDto);
  }

  @Patch(":id/password")
  @Role("Admin")
  Admin__PatchClientPassword(
    @Param("id") id: string,
    @Body() PatchPasswordDto: PatchPasswordDto
  ) {
    return this.clientService.PatchPassword(id, PatchPasswordDto.password);
  }

  @Patch(":id/password")
  @Role("Client")
  Client__PatchClientPassword(
    @Param("id") id: string,
    @User() user,
    @Body() PatchPasswordDto: PatchPasswordDto
  ) {
    if (user.Role == "Client" && id === user.id)
      return this.clientService.PatchPassword(
        user.id,
        PatchPasswordDto.password
      );
    throw new ForbiddenException(
      "You are not Authorized to Update Password For This Client"
    );
  }
  @Delete("bulk")
  @Role("Admin")
  DeleteManyClients(@Body() ClientDeleteManyDto: ClientDeleteManyDto) {
    return this.clientService.DeleteManyClients(ClientDeleteManyDto.ids);
  }
  @Delete(":id")
  @Role("Admin")
  DeleteClient(@Param("id") id: string) {
    return this.clientService.DeleteClient(id);
  }
}
