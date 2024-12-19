import { Prisma, Unburden } from "@prisma/client";

export interface UnburdenOutput extends Unburden {
  commentsAmount: number;
  suportsAmount: number;
  supported: boolean;
}

export interface FindManyParams {
  page: number;
  take: number;
  sessionId: string;
}

export interface FindUniqueParams {
  id: string;
  sessionId: string;
}

export interface IUnburdenRepository {
  create(data: Prisma.UnburdenCreateInput): Promise<UnburdenOutput>;
  findMany(params: FindManyParams): Promise<UnburdenOutput[]>;
  findUnique(params: FindUniqueParams): Promise<UnburdenOutput | null>;
  total(): Promise<number>;
}
