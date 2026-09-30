import { httpClient } from "./client";
import { CommentType } from "@/types";

export async function fetchUnburdenComments(
  unburdenId: string,
): Promise<CommentType[]> {
  const response = await httpClient.get<{ comments: CommentType[] }>(
    `/api/v1/comment`,
    {
      params: { unburden_id: unburdenId },
    },
  );

  return response.data.comments;
}
