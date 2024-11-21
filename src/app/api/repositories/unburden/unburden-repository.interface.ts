import { Prisma, Unburden } from "@prisma/client";

export interface UnburdenWithSupports extends Unburden {
  suportsAmount: number;
}

export interface IUnburdenRepository {
  create(data: Prisma.UnburdenCreateInput): Promise<UnburdenWithSupports>;
  findMany(): Promise<UnburdenWithSupports[]>;
}
