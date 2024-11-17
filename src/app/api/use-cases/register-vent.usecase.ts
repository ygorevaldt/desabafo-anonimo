import { Vent } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import { IVentRepository } from "../repositories/vent/vent-repository.interface";

type Input = {
  title: string;
  description: string;
};

type Output = {
  vent: Vent;
};

export class RegisterVentUseCase implements IUseCase<Input, Output> {
  constructor(private ventRepository: IVentRepository) {}

  async execute(data: Input): Promise<Output> {
    const vent = await this.ventRepository.create(data);
    return { vent };
  }
}
