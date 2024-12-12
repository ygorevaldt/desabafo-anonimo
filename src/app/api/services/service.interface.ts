export interface IService<In, Out> {
  execute(params: In): Promise<Out>;
}
