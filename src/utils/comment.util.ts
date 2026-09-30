import { CommentType } from "@/types/comment.type";

export function countTotalComments(comments: CommentType[]): number {
  return comments.reduce(
    (acc, comment) => acc + 1 + (comment.subcomments?.length || 0),
    0,
  );
}

export function formatCommentsCount(count: number): string {
  return `${count} ${count === 1 ? "comentário" : "comentários"}`;
}

export function formatSupportsCount(count: number): string {
  return `${count} ${count === 1 ? "apoio" : "apoios"}`;
}

export function formatRepliesCount(count: number): string {
  return `${count} ${count === 1 ? "resposta" : "respostas"}`;
}
