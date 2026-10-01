import { httpClient } from "./client";
import { UnburdenType } from "@/types";

type RegisterUnburdenParams = {
  title: string;
  content: string;
  wantsAiComfort?: boolean;
};

export async function registerUnburden(
  data: RegisterUnburdenParams,
): Promise<UnburdenType> {
  const response = await httpClient.post<UnburdenType>(
    "/api/gateway/v1/unburden",
    data,
  );
  return response.data;
}
