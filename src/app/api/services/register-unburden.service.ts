import { IService } from "./service.interface";
import {
  IUnburdenRepository,
  UnburdenOutput,
} from "../repositories/unburden/unburden-repository.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { AiModerationService } from "./ai-moderation.service";
import { AiComfortService } from "./ai-comfort.service";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

type Input = {
  title: string;
  content: string;
  wantsAiComfort?: boolean;
};

type Output = {
  unburden: UnburdenOutput;
};

export class RegisterUnburdenService implements IService<Input, Output> {
  private moderationService: AiModerationService;
  private comfortService: AiComfortService;

  constructor(
    private unburdenRepository: IUnburdenRepository,
    private commentRepository?: ICommentRepository,
    moderationService?: AiModerationService,
    comfortService?: AiComfortService,
  ) {
    this.moderationService = moderationService ?? new AiModerationService();
    this.comfortService = comfortService ?? new AiComfortService();
  }

  async execute(data: Input): Promise<Output> {
    const moderation = await this.moderationService.moderate(
      data.content,
      data.title,
    );

    if (moderation.status === "BLOCKED") {
      throw new UnauthorizedContentException();
    }

    const unburden = await this.unburdenRepository.create({
      title: data.title,
      content: data.content,
      sensitiveContent: moderation.isSensitive,
    });

    if (data.wantsAiComfort && this.commentRepository) {
      try {
        const comfortMessage = await this.comfortService.generateComfortMessage(
          data.title,
          data.content,
        );
        if (comfortMessage) {
          await this.commentRepository.create({
            unburdenId: unburden.id,
            content: `🤖 [Acolhimento Inicial - IA]\n${comfortMessage}`,
            sensitiveContent: false,
          });
        }
      } catch (comfortError) {
        console.warn(
          "Não foi possível gerar mensagem de conforto inicial:",
          comfortError,
        );
      }
    }

    return { unburden };
  }
}
