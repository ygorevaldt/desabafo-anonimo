import { Unburden } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";

type Output = {
  unburdens: Unburden[];
};

export class ListUnburdensUseCase implements IUseCase<void, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(): Promise<Output> {
    const unburdens = await this.unburdenRepository.findMany();
    return { unburdens };
  }
}
