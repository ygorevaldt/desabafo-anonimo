export class IaSupportMessageResponseDto {
  readonly support_message: string;

  constructor(text: string) {
    this.support_message = text;
  }
}
