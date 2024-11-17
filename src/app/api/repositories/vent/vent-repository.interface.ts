import { Prisma, Vent } from "@prisma/client";

export interface IVentRepository {
  create(data: Prisma.VentCreateInput): Promise<Vent>;
}
