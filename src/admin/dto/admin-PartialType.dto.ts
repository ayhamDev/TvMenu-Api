import { PartialType } from "@nestjs/mapped-types";
import { AdminDto } from "./admin.dto";

export class AdminDtoPartialType extends PartialType(AdminDto) {}
