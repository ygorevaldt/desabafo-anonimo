import { Support } from "@prisma/client";

export class SupportResponseDto {
  readonly id: string;

  constructor({ id }: Support) {
    this.id = id;
  }
}
