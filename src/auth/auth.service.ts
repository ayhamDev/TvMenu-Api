import { CleanPromiseService } from "@CleanPromise/clean-promise";
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as moment from "moment";
import { AdminService } from "src/admin/admin.service";
import { AdminDto } from "src/admin/dto/admin.dto";
import { ClientService } from "src/client/client.service";
import { AuthDto } from "./dto/auth.dto";
@Injectable()
export class AuthService {
  constructor(
    private readonly AdminSerivce: AdminService,
    private readonly ClientService: ClientService,
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
    const payload = this.JwtService.decode(Token);
    const [User, UserError] = await this.CleanPromise.Do(
      payload.Role == "Admin"
        ? this.AdminSerivce.findById(payload.id)
        : this.ClientService.findByid(payload.id)
    );

    if (UserError) return [null, UserError];
    if (!User) return [null, true];
    const HasBeenUpdated = !moment(payload.updatedAt).isSame(User.updatedAt);
    if (HasBeenUpdated) return [null, true];

    return [payload, null];
  }
  async IssueToken(payload: object | Buffer) {
    return this.JwtService.signAsync(payload);
  }
  async AdminLogin(AuthDto: AuthDto) {
    const admin = await this.AdminSerivce.ValidateCredentials(AuthDto);

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
  async ClientLogin(AuthDto: AuthDto) {
    const admin = await this.ClientService.ValidateCredentials(AuthDto);
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
