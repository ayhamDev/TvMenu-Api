import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ProgramService } from "./program.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role/role.decorator";
import { CreateProgramDto } from "./dto/create-program.dto";
import { ProgramDeleteManyDto } from "./dto/progran-deletemany.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { UUID } from "crypto";
import { uuidDto } from "src/dto/UUID.dto";
import { UpdateManyProgramDto } from "./dto/update-many-program.dto";

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
  findProgramById(@Param() params: uuidDto) {
    return this.programService.findById(params.id);
  }

  @Post()
  @Role("Admin")
  CreateProgram(@Body() CreateProgramDto: CreateProgramDto) {
    return this.programService.Create(CreateProgramDto);
  }

  @Patch("/bulk")
  @Role("Admin")
  PatchManyProgramsById(@Body() data: UpdateManyProgramDto) {
    return this.programService.PatchManyById(data);
  }
  @Patch("/:id")
  @Role("Admin")
  PatchProgramById(@Param() params: uuidDto, @Body() data: UpdateProgramDto) {
    return this.programService.PatchById(params.id, data);
  }

  @Delete("/bulk")
  @Role("Admin")
  DeleteManyProgramById(@Body() ProgramDeleteManyDto: ProgramDeleteManyDto) {
    return this.programService.DeleteManyById(ProgramDeleteManyDto.ids);
  }
  @Delete("/:id")
  @Role("Admin")
  DeleteProgramById(@Param() params: uuidDto) {
    return this.programService.DeleteById(params.id);
  }
}
