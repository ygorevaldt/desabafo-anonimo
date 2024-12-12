export class InvalidSessionIdException extends Error {
  constructor() {
    super("Invalid session id");
  }
}
