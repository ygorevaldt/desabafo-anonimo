export interface IUseCase<In, Out> {
  execute(params: In): Promise<Out>;
}
