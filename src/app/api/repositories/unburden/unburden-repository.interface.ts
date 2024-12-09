import { Prisma, Unburden } from "@prisma/client";

export interface UnburdenWithSupports extends Unburden {
  suportsAmount: number;
  supported: boolean;
}

export interface FindManyParams {
  page: number;
  take: number;
  sessionId: string;
}

export interface IUnburdenRepository {
  create(data: Prisma.UnburdenCreateInput): Promise<UnburdenWithSupports>;
  findMany(params: FindManyParams): Promise<UnburdenWithSupports[]>;
  total(): Promise<number>;
}
