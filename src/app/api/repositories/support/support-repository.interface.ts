import { Prisma, Support } from "@prisma/client";

export interface ISupportRepository {
  create(data: Prisma.SupportUncheckedCreateInput): Promise<Support>;
}
