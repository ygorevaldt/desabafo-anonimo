import { httpClient } from "./client";
import { CommentType } from "@/types";

type RegisterCommentReplyParams = {
  comment_id: string;
  content: string;
};

export async function registerCommentReply(
  data: RegisterCommentReplyParams,
): Promise<CommentType> {
  const response = await httpClient.post<CommentType>("/api/v1/comment", data);
  return response.data;
}
