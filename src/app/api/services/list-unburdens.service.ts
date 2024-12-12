import { IService } from "./service.interface";
import {
  IUnburdenRepository,
  UnburdenWithSupports,
} from "../repositories/unburden/unburden-repository.interface";

type Input = {
  page: number;
  sessionId: string;
};

type Output = {
  unburdens: UnburdenWithSupports[];
  page: number;
  take: number;
  total: number;
};

export class ListUnburdensService implements IService<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute({ page, sessionId = "" }: Input): Promise<Output> {
    const REGISTERS_BY_PAGE_TOTAL = 25;

    const [unburdens, total] = await Promise.all([
      this.unburdenRepository.findMany({
        page: page ?? 1,
        take: REGISTERS_BY_PAGE_TOTAL,
        sessionId,
      }),
      this.unburdenRepository.total(),
    ]);

    return {
      unburdens,
      page,
      take: REGISTERS_BY_PAGE_TOTAL,
      total,
    };
  }
}
