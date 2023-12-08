import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { Role } from "src/auth/role/role.decorator";
import { PatchPasswordDto } from "src/auth/dto/PatchPassword.dto";
import { ClientDeleteManyDto } from "./dto/client-deletemany.dto";
import { User } from "src/auth/user/user.decorator";
import { use } from "passport";

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
  @Role("Admin", "Client")
  PatchAdminPassword(
    @Param("id") id: string,
    @User() user,
    @Body() PatchPasswordDto: PatchPasswordDto
  ) {
    if (user.Role == "Admin")
      return this.clientService.PatchPassword(id, PatchPasswordDto.password);
    if (user.Role == "Client" && id === user.id)
      return this.clientService.PatchPassword(
        user.id,
        PatchPasswordDto.password
      );
    throw new ForbiddenException(
      "You are not authorized to update this password"
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
