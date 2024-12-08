import { IUseCase } from "./use-case.interface";
import {
  IUnburdenRepository,
  UnburdenWithSupports,
} from "../repositories/unburden/unburden-repository.interface";

type Input = {
  page: number;
};

type Output = {
  unburdens: UnburdenWithSupports[];
  page: number;
  take: number;
  total: number;
};

export class ListUnburdensUseCase implements IUseCase<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute({ page }: Input): Promise<Output> {
    const take = 25;
    const [unburdens, total] = await Promise.all([
      this.unburdenRepository.findMany(page ?? 1, take),
      this.unburdenRepository.total(),
    ]);

    return {
      unburdens,
      page,
      take,
      total,
    };
  }
}
