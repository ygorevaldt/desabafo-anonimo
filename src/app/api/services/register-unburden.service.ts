import { IService } from "./service.interface";
import {
  IUnburdenRepository,
  UnburdenOutput,
} from "../repositories/unburden/unburden-repository.interface";
import { checkContentTemperature, checkSensitiveContent } from "../utils";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

type Input = {
  title: string;
  content: string;
};

type Output = {
  unburden: UnburdenOutput;
};

export class RegisterUnburdenService implements IService<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(data: Input): Promise<Output> {
    const contentTemperature = checkContentTemperature(data.content);
    console.log("CONTENT TEMPERATURE", contentTemperature);
    if (contentTemperature === "red") throw new UnauthorizedContentException();

    const unburden = await this.unburdenRepository.create({
      ...data,
      sensitiveContent: checkSensitiveContent(data.content),
    });
    return { unburden };
  }
}
