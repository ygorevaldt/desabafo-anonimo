import { Unburden } from "@prisma/client";
import { IService } from "./service.interface";
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

export class RegisterUnburdenService implements IService<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(data: Input): Promise<Output> {
    console.log("data", data);
    const unburden = await this.unburdenRepository.create(data);
    return { unburden };
  }
}
