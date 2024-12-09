import { Unburden } from "@prisma/client";
import { UnburdenWithSupports } from "@/app/api/repositories/unburden/unburden-repository.interface";

export class UnburdenResponseDto {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly created_at: Date;
  readonly supports_amount?: number;
  readonly supported?: boolean;

  constructor({
    id,
    title,
    content,
    createdAt,
    suportsAmount,
    supported,
  }: UnburdenWithSupports) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.created_at = createdAt;
    this.supports_amount = suportsAmount;
    this.supported = supported;
  }
}
