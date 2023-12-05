import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly AuthService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization }: any = request.headers;

    if (!authorization || authorization.trim() === "") return false;

    const Token = authorization.replace(/bearer/gim, "").trim();

    const [payload, error] = await this.AuthService.ValidateToken(Token);

    if (error) return false;
    request.user = payload;
    return true;
  }
}
