export class SupportMessageResponseDto {
  readonly support_message: string;

  constructor(supportMessage: string) {
    this.support_message = supportMessage;
  }
}
