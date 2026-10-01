import { Report } from "@prisma/client";

export type CreateReportInput = {
  sessionId: string;
  unburdenId: string;
  reason?: string;
};

export interface IReportRepository {
  create(data: CreateReportInput): Promise<Report>;
  findBySessionAndUnburden(
    sessionId: string,
    unburdenId: string,
  ): Promise<Report | null>;
  countByUnburdenId(unburdenId: string): Promise<number>;
}
