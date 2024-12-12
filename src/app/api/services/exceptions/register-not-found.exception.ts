export class RegisterNotFoundException extends Error {
  constructor() {
    super("Register not found");
  }
}
