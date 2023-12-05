import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminService } from "src/admin/admin.service";
import { AdminDto } from "src/admin/dto/admin.dto";
import { JwtService } from "@nestjs/jwt";
import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    private readonly AdminSerivce: AdminService,
    private readonly JwtService: JwtService,
    private readonly CleanPromise: CleanPromiseService,
    private readonly ConfigService: ConfigService
  ) {}
  async ValidateToken(Token: string) {
    const [valid, error] = await this.CleanPromise.Do(
      this.JwtService.verifyAsync(Token, {
        secret: this.ConfigService.get("TOKEN_KEY"),
      })
    );
    if (error) return [null, error];
    if (!valid) return [null, "Not Valid"];

    return [this.JwtService.decode(Token), null];
  }
  async IssueToken(payload: object | Buffer) {
    return this.JwtService.signAsync(payload);
  }
  async AdminLogin(adminDto: AdminDto) {
    const admin = await this.AdminSerivce.Login(adminDto);
    if (!admin) throw new UnauthorizedException("Email Or Password is Invalid");

    const [Token, error] = await this.CleanPromise.Do(
      this.IssueToken({ ...admin, Role: "Admin" })
    );

    if (error)
      throw new InternalServerErrorException(
        "The Server Couldn't Sign The Token"
      );
    return { Token, meesage: "Logged in Successfully.", statusCode: 200 };
  }
  async ClientLogin(adminDto: AdminDto) {
    const admin = await this.AdminSerivce.Login(adminDto);
    if (!admin) throw new UnauthorizedException("Email Or Password is Invalid");

    const [Token, error] = await this.CleanPromise.Do(
      this.IssueToken({ ...admin, Role: "Client" })
    );

    if (error)
      throw new InternalServerErrorException(
        "The Server Couldn't Sign The Token"
      );
    return { Token, meesage: "Logged in Successfully.", statusCode: 200 };
  }
}
