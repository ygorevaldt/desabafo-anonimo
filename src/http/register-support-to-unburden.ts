import { httpClient } from "./client";
import { UnburdenType } from "@/types";

export async function registerSupportToUnburden(
  unburden: UnburdenType,
): Promise<void> {
  if (unburden.supported) return;

  await httpClient.post("/api/v1/support", {
    unburden_id: unburden.id,
  });
}
