import { IService } from "./service.interface";
import {
  IUnburdenRepository,
  UnburdenOutput,
} from "../repositories/unburden/unburden-repository.interface";

type Input = {
  page: number;
  sessionId: string;
};

type Output = {
  unburdens: UnburdenOutput[];
  page: number;
  take: number;
  total: number;
};

export class ListUnburdensService implements IService<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute({ page, sessionId = "" }: Input): Promise<Output> {
    const REGISTERS_BY_PAGE_TOTAL = 25;

    console.log("page", page);
    console.log("sessionId", sessionId);

    const [unburdens, total] = await Promise.all([
      this.unburdenRepository.findMany({
        page: page ?? 1,
        take: REGISTERS_BY_PAGE_TOTAL,
        sessionId,
      }),
      this.unburdenRepository.total(),
    ]);

    console.log("unburdens", unburdens);
    console.log("total", total);

    return {
      unburdens,
      page,
      take: REGISTERS_BY_PAGE_TOTAL,
      total,
    };
  }
}
