import { Report } from "@prisma/client";
import { database } from "@/app/api/infra/database";
import {
  CreateReportInput,
  IReportRepository,
} from "./report-repository.interface";

export class PrismaReportRepository implements IReportRepository {
  async create(data: CreateReportInput): Promise<Report> {
    return await database.report.create({
      data: {
        sessionId: data.sessionId,
        unburdenId: data.unburdenId,
        reason: data.reason,
      },
    });
  }

  async findBySessionAndUnburden(
    sessionId: string,
    unburdenId: string,
  ): Promise<Report | null> {
    return await database.report.findUnique({
      where: {
        sessionId_unburdenId: {
          sessionId,
          unburdenId,
        },
      },
    });
  }

  async countByUnburdenId(unburdenId: string): Promise<number> {
    return await database.report.count({
      where: {
        unburdenId,
      },
    });
  }
}
