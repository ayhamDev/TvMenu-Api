import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  ConflictException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Repository, TypeORMError } from "typeorm";
import { Admin } from "./entities/admin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminDto } from "./dto/admin.dto";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    private readonly CleanPromise: CleanPromiseService
  ) {}
  async onModuleInit() {
    const [Admin, Error] = await this.CleanPromise.Do(
      this.AdminRepository.find({
        take: 1,
      })
    );
    if (Error)
      throw new InternalServerErrorException(
        "Couldn't Create The Defualt Admin"
      );
    if (Admin.length == 0) {
      console.log("Creating Defualt Admin...");
      await this.Register({
        email: "admin@example.com",
        password: "123qweasdZXC_-",
      });
      console.log("Defualt Admin Created Successfully :");
      console.table({
        email: "admin@example.com",
        password: "123qweasdZXC_-",
      });
    }
  }

  async Register(adminDto: AdminDto) {
    const [HashedPassword, HashError] = await this.CleanPromise.Do<string>(
      bcrypt.hash(adminDto.password, 10)
    );
    if (HashError)
      throw new InternalServerErrorException("Couldn't Hash The Password");
    const NewAdmin = this.AdminRepository.create({
      email: adminDto.email,
      password: HashedPassword,
    });
    const [RegisteredAdmin, AdminError] = await this.CleanPromise.Do(
      this.AdminRepository.save(NewAdmin)
    );
    if (AdminError)
      throw new ConflictException("Admin With This Email Already Exists");
    const { password, ...reset } = RegisteredAdmin;
    return {
      message: "Admin Created Successfully",
      statusCode: HttpStatus.CREATED,
      data: reset,
    };
  }
  async Login(adminDto: AdminDto) {
    const [admin, error] = await this.CleanPromise.Do(
      this.AdminRepository.findOne({
        where: {
          email: adminDto.email,
        },
      })
    );
    if (error) throw new InternalServerErrorException();
    if (!admin) return null;

    const PasswordValid = await this.CleanPromise.Do(
      bcrypt.compare(adminDto.password, admin.password)
    );
    if (!PasswordValid) return null;
    const { password, ...reset } = admin;
    return reset;
  }
  async findById(id: string) {
    if (!id) throw new BadRequestException("Missing Parameter");
    const [Admin, error] = await this.CleanPromise.Do(
      this.AdminRepository.findOne({
        where: {
          id,
        },
      })
    );
    if (error) throw new NotFoundException("Admin Not Found");
    const { password, ...rest } = Admin;
    return rest;
  }
}
