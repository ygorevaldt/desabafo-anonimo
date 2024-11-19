import { Prisma } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import { database } from "@/app/api/infra/database";

type ServerVersion = {
  server_version: string;
};

type MaxConnections = {
  max_connections: string;
};

type OpenedConnections = {
  opened_connections: number;
};

type DataBaseInfo = {
  version: string;
  maxConnections: number;
  openedConnections: number;
};

type Output = {
  updatedAt: string;
  database: DataBaseInfo;
};

export class FetchApiStatus implements IUseCase<void, Output> {
  async execute(): Promise<Output> {
    const updatedAt = new Date().toISOString();

    const databaseVersion = (
      await database.$queryRaw<ServerVersion[]>/*sql*/ `SHOW server_version;`
    )[0].server_version;

    const databaseMaxConnections = (
      await database.$queryRaw<MaxConnections[]>/*sql*/ `SHOW max_connections`
    )[0].max_connections;

    const databaseOpenedConnections = (
      await database.$queryRaw<
        OpenedConnections[]
      >/*sql*/ `SELECT COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = ${process.env.POSTGRESQL_DATABASE}`
    )[0].opened_connections;

    return {
      updatedAt,
      database: {
        version: databaseVersion,
        maxConnections: parseInt(databaseMaxConnections),
        openedConnections: databaseOpenedConnections,
      },
    };
  }
}
