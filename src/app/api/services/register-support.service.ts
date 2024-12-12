import { Support } from "@prisma/client";
import { ISupportRepository } from "../repositories/support/support-repository.interface";
import { IService } from "./service.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";
import {
  RegisterNotFoundException,
  InvalidSessionIdException,
} from "./exceptions";

type Input = {
  unburdenId: string;
  sessionId?: string;
};

type Output = {
  support: Support;
};

export class RegisterSupportService implements IService<Input, Output> {
  constructor(
    private unburdenRepository: IUnburdenRepository,
    private supportRepository: ISupportRepository,
  ) {}

  async execute(data: Input): Promise<Output> {
    if (!data.sessionId) throw new InvalidSessionIdException();

    const registredUnburden = await this.unburdenRepository.findUnique(
      data.unburdenId,
    );
    if (registredUnburden === null) throw new RegisterNotFoundException();

    const support = await this.supportRepository.create(data);
    return { support };
  }
}
