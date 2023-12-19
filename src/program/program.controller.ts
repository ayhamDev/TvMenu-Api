import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { CreateProgramDto } from "./dto/create-program.dto";

@Controller("program")
@UseGuards(AuthGuard)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  @Role("Admin")
  GetAllPrograms() {
    return this, this.programService.GetAll();
  }

  @Get("/:id")
  @Role("Admin")
  findProgramById(@Param("id") id: string) {
    return this.programService.findById(id);
  }

  @Post()
  @Role("Admin")
  CreateProgram(@Body() CreateProgramDto: CreateProgramDto) {
    return this.programService.Create(CreateProgramDto);
  }
}
