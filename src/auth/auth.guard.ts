import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenExpiredError } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly AuthService: AuthService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string>("role", context.getHandler());

    const { authorization }: any = request.headers;

    if (!authorization || authorization.trim() === "")
      throw new UnauthorizedException("Token Is Required");

    const Token = authorization.replace(/bearer/gim, "").trim();

    const [payload, error] = await this.AuthService.ValidateToken(Token);

    if (error instanceof TokenExpiredError)
      throw new UnauthorizedException("Token Is Expired");
    if (error) throw new UnauthorizedException("Token Is Invalid");

    if (roles && !roles.includes(payload.Role)) return false;
    request.user = payload;

    return true;
  }
}
