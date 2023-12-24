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
import { AuthDto } from "src/auth/dto/auth.dto";

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
    const [RegisteredAdmin, error] = await this.CleanPromise.Do(
      this.AdminRepository.save(NewAdmin)
    );
    if (error.message.includes("duplicate key"))
      throw new ConflictException("Admin With This Email Already Exists");
    if (error)
      throw new InternalServerErrorException("Couldn't Save The Admin");

    const { password, ...RegisteredAdminData } = RegisteredAdmin;
    return {
      message: "Admin Created Successfully",
      statusCode: HttpStatus.CREATED,
      data: RegisteredAdminData,
    };
  }
  async ValidateCredentials(AuthDto: AuthDto) {
    const [admin, error] = await this.CleanPromise.Do(
      this.AdminRepository.findOne({
        where: {
          email: AuthDto.email,
        },
      })
    );
    if (error) throw new InternalServerErrorException("Couldn't Find Admin");
    if (!admin) return null;

    const [PasswordValid, CompareError] = await this.CleanPromise.Do(
      bcrypt.compare(AuthDto.password, admin.password)
    );

    if (CompareError)
      throw new InternalServerErrorException("Couldn't Verify Password");
    if (!PasswordValid) return null;
    const { password, ...reset } = admin;
    return reset;
  }
  async GetAll() {
    const [admins, error] = await this.CleanPromise.Do(
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
    return admins;
  }
  async findById(id: string) {
    if (!id) throw new BadRequestException("Missing Parameter id");
    const [admin, error] = await this.CleanPromise.Do(
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
    if (error)
      throw new InternalServerErrorException(
        "The Given Id is Not Of The Type Uniqueidentifier"
      );
    if (!admin) throw new NotFoundException("No Admin Found With The Given Id");
    return admin;
  }

  async PatchPassword(id: string, password: string) {
    const admin = await this.findById(id);
    const HashedPassword = await this.HashPassword.Do(password);
    admin.password = HashedPassword;
    const [PatchedAdmin, error] = await this.CleanPromise.Do(
      this.AdminRepository.save(admin, {})
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Patch Password");
    return {
      message: "Password Updated Successfully",
      StatusCode: 200,
    };
  }
  async DeleteManyAdmins(ids: string[]) {
    const [admins, error] = await this.CleanPromise.Do(
      this.AdminRepository.createQueryBuilder().whereInIds(ids).getMany()
    );

    if (error)
      throw new InternalServerErrorException(
        "Couldn't Verify Admins, Plase Check The Client Ids"
      );
    if (admins.length !== ids.length)
      throw new NotFoundException("Some Or All Admins Were Not Found");
    const [DeletedAdmins, DeletingError] = await this.CleanPromise.Do(
      this.AdminRepository.remove([...admins])
    );

    if (DeletingError)
      throw new InternalServerErrorException("Couldn't Delete the Admins");
    if (DeletedAdmins && DeletedAdmins.length === 0)
      throw new NotFoundException(
        "No Admins Found With The Given Ids To Delete"
      );
    return {
      Message: "The Admins Were Deleted Successfully",
      StatusCode: 204,
    };
  }

  async DeleteAdmin(id: string) {
    const [DeletedAdmin, error] = await this.CleanPromise.Do(
      this.AdminRepository.delete({
        id,
      })
    );
    if (error)
      throw new InternalServerErrorException("Couldn't Delete the Admin");
    if (DeletedAdmin && !DeletedAdmin.affected)
      throw new NotFoundException("No Admin Found With The Given Id To Delete");
    return {
      Message: "The Admin Was Deleted Successfully",
      StatusCode: 204,
    };
  }
}
