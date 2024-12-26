export interface IaProvider {
  generateResponse(prompt: string): Promise<string>;
}
