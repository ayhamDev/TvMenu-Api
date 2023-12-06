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
import { AdminDtoPartialType } from "./dto/admin-PartialType.dto";
import { HashPasswordService } from "src/auth/hash-password/hash-password.service";

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    private readonly CleanPromise: CleanPromiseService,
    private readonly HashPassword: HashPasswordService
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
    const HashedPassword = await this.HashPassword.Do(adminDto.password);
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
  async ValidateCredentials(adminDto: AdminDto) {
    const [admin, error] = await this.CleanPromise.Do(
      this.AdminRepository.findOne({
        where: {
          email: adminDto.email,
        },
      })
    );
    if (error) throw new InternalServerErrorException();
    if (!admin) return null;

    const [PasswordValid, CompareError] = await this.CleanPromise.Do(
      bcrypt.compare(adminDto.password, admin.password)
    );

    if (CompareError)
      throw new InternalServerErrorException("Couldn't Verify Password");
    if (!PasswordValid) return null;
    const { password, ...reset } = admin;
    return reset;
  }
  async GetAll() {
    const [Admins, error] = await this.CleanPromise.Do(
      this.AdminRepository.find({
        select: {
          id: true,
          email: true,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
      })
    );
    if (error) throw new InternalServerErrorException();
    return Admins;
  }
  async findById(id: string) {
    if (!id) throw new BadRequestException("Missing Parameter");
    const [Admin, error] = await this.CleanPromise.Do(
      this.AdminRepository.findOne({
        select: {
          id: true,
          email: true,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id,
        },
      })
    );
    if (error) throw new NotFoundException("Admin Not Found");
    return Admin;
  }

  async PatchPassword(id: string, password: string) {
    const Admin = await this.findById(id);
    const HashedPassword = await this.HashPassword.Do(password);
    Admin.password = HashedPassword;
    const [PatchedAdmin, error] = await this.CleanPromise.Do(
      this.AdminRepository.save(Admin, {})
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Patch Password");
    return {
      message: "Password Patched Successfully",
      StatusCode: 200,
    };
  }
  async DeleteAdmin(id: string) {
    const [DeletedAdmin, error] = await this.CleanPromise.Do(
      this.AdminRepository.delete({
        id,
      })
    );
    console.log(error);
    return DeletedAdmin;
  }
}
