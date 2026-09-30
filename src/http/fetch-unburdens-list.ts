import { httpClient } from "./client";
import { UnburdenType } from "@/types";

type FetchUnburdensListParams = {
  page: number;
  take?: number;
};

type FetchUnburdensListResponse = {
  unburdens: UnburdenType[];
  page: number;
  take: number;
  total: number;
};

export async function fetchUnburdensList({
  page,
}: FetchUnburdensListParams): Promise<FetchUnburdensListResponse> {
  const response = await httpClient.get<FetchUnburdensListResponse>(
    `/api/v1/unburden`,
    {
      params: { page },
    },
  );

  return response.data;
}
