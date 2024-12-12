import { FetchApiStatusOutput } from "@/app/api/services/fetch-api-status.service";

type Database = {
  version: string;
  max_connections: number;
  opened_connections: number;
};

export class StatusResponseDto {
  readonly updated_at: string;
  readonly database: Database;

  constructor({ updatedAt, database }: FetchApiStatusOutput) {
    this.updated_at = updatedAt;
    this.database = {
      version: database.version,
      max_connections: database.maxConnections,
      opened_connections: database.openedConnections,
    };
  }
}
