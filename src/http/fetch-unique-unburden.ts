import { httpClient } from "./client";
import { UnburdenType } from "@/types";

export async function fetchUniqueUnburden(
  unburdenId: string,
): Promise<UnburdenType> {
  const response = await httpClient.get<{ unburden: UnburdenType }>(
    `/api/v1/unburden/${unburdenId}`,
  );
  return response.data.unburden;
}
