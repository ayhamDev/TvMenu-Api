import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { UnregisteredService } from "./unregistered.service";

@Controller("unregistered")
export class UnregisteredController {
  constructor(private readonly unregisteredService: UnregisteredService) {}
}
