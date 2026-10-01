import { httpClient } from "./client";
import { CommentType } from "@/types";

type RegisterCommentParams = {
  unburden_id: string;
  content: string;
};

export async function registerComment(
  data: RegisterCommentParams,
): Promise<CommentType> {
  const response = await httpClient.post<CommentType>("/api/gateway/v1/comment", data);
  return response.data;
}
