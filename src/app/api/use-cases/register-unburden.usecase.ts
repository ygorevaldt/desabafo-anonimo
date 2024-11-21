import { Unburden } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import {
  IUnburdenRepository,
  UnburdenWithSupports,
} from "../repositories/unburden/unburden-repository.interface";

type Input = {
  title: string;
  content: string;
};

type Output = {
  unburden: UnburdenWithSupports;
};

export class RegisterUnburdenUseCase implements IUseCase<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(data: Input): Promise<Output> {
    console.log("data", data);
    const unburden = await this.unburdenRepository.create(data);
    return { unburden };
  }
}
