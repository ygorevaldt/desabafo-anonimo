import { CommentWithSubcomments } from "@/app/api/repositories/comment/comment-repository.interface";

export class CommentResponseDto {
  readonly id: string;
  readonly content: string;
  readonly created_at: Date;
  readonly subcomment_id?: string | null;
  readonly subcomments?: CommentResponseDto[];

  constructor({
    id,
    content,
    createdAt,
    subcommentId,
    subcomments,
  }: CommentWithSubcomments) {
    this.id = id;
    this.content = content;
    this.created_at = createdAt;
    this.subcomment_id = subcommentId ?? null;
    this.subcomments = subcomments
      ? subcomments.map((sub) => new CommentResponseDto(sub))
      : [];
  }
}
