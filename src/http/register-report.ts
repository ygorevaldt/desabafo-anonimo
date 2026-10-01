import { httpClient } from "./client";

type RegisterReportParams = {
  unburdenId: string;
  reason?: string;
};

export type RegisterReportResponse = {
  success: boolean;
  message: string;
  alreadyReported: boolean;
  reportCount: number;
};

export async function registerReport(
  params: RegisterReportParams,
): Promise<RegisterReportResponse> {
  const response = await httpClient.post<RegisterReportResponse>(
    `/api/gateway/v1/unburden/${params.unburdenId}/report`,
    {
      reason: params.reason,
    },
  );
  return response.data;
}
