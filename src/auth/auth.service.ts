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
    const payload = this.JwtService.decode(Token);
    const [admin, adminError] = await this.CleanPromise.Do(
      this.AdminSerivce.findById(payload.id)
    );
    if (adminError) return [null, adminError];
    if (!admin) return [null, true];
    const ValidToken = moment(payload.updatedAt).isSame(admin.updatedAt);
    if (!ValidToken) return [null, true];

    return [payload, null];
  }
  async IssueToken(payload: object | Buffer) {
    return this.JwtService.signAsync(payload);
  }
  async AdminLogin(adminDto: AdminDto) {
    const admin = await this.AdminSerivce.ValidateCredentials(adminDto);

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
    const admin = await this.AdminSerivce.ValidateCredentials(adminDto);
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
