export class UnauthorizedContentException extends Error {
  constructor() {
    super("Unauthorized content");
  }
}
