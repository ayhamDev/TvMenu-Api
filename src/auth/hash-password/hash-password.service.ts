import { CleanPromiseService } from "@CleanPromise/clean-promise";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashPasswordService {
  constructor(private readonly CleanPromise: CleanPromiseService) {}
  async Do(password: string) {
    const [HashedPassword, HashError] = await this.CleanPromise.Do<string>(
      bcrypt.hash(password, 10)
    );
    if (HashError)
      throw new InternalServerErrorException("Couldn't Hash The Password");
    return HashedPassword;
  }
}
