import { database } from "@/app/api/infra/database";

export async function cleanDatabase() {
  await database.support.deleteMany();
  await database.comment.deleteMany();
  await database.unburden.deleteMany();
}
