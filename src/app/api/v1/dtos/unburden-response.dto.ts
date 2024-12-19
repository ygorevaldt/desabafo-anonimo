import { Unburden } from "@prisma/client";
import { UnburdenOutput } from "@/app/api/repositories/unburden/unburden-repository.interface";

export class UnburdenResponseDto {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly created_at: Date;
  readonly supports_amount?: number;
  readonly comments_amount?: number;
  readonly supported?: boolean;

  constructor({
    id,
    title,
    content,
    createdAt,
    suportsAmount,
    commentsAmount,
    supported,
  }: UnburdenOutput) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.created_at = createdAt;
    this.supports_amount = suportsAmount;
    this.comments_amount = commentsAmount;
    this.supported = supported;
  }
}
