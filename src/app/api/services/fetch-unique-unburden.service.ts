import {
  IUnburdenRepository,
  UnburdenOutput,
} from "../repositories/unburden/unburden-repository.interface";
import { IService } from "./service.interface";
import { RegisterNotFoundException } from "./exceptions";

type Input = {
  id: string;
  sessionId: string;
};

type Output = {
  unburden: UnburdenOutput;
};

export class FetchUniqueUnburdenService implements IService<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(params: Input): Promise<Output> {
    const unburden = await this.unburdenRepository.findUnique(params);
    if (unburden === null) {
      throw new RegisterNotFoundException();
    }

    return { unburden };
  }
}
