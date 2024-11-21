import { Unburden } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";

type Input = {
  title: string;
  description: string;
};

type Output = {
  unburden: Unburden;
};

export class RegisterUnburdenUseCase implements IUseCase<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(data: Input): Promise<Output> {
    const unburden = await this.unburdenRepository.create(data);
    return { unburden };
  }
}
