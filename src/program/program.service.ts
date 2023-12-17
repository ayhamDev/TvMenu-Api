import { Injectable, UseGuards } from "@nestjs/common";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Injectable()
@UseGuards(AuthGuard)
export class ProgramService {}
