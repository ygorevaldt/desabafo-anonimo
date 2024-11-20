import { Prisma, Unburden } from "@prisma/client";

export interface IUnburdenRepository {
  create(data: Prisma.UnburdenCreateInput): Promise<Unburden>;
  findMany(): Promise<Unburden[]>;
}
