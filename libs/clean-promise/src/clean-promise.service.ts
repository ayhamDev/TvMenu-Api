import { Injectable } from "@nestjs/common";

@Injectable()
export class CleanPromiseService {
  async Do<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
    try {
      const Results = await promise;
      return [Results, null];
    } catch (err) {
      return [null, err];
    }
  }
}
