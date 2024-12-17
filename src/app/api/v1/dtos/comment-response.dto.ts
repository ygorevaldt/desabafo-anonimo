import { Comment } from "@prisma/client";

export class CommentResponseDto {
  readonly id: string;
  readonly content: string;
  readonly created_at: Date;

  constructor({ id, content, createdAt }: Comment) {
    this.id = id;
    this.content = content;
    this.created_at = createdAt;
  }
}
