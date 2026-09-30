import { IService } from "./service.interface";
import {
  IUnburdenRepository,
  UnburdenOutput,
} from "../repositories/unburden/unburden-repository.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { AiModerationService } from "./ai-moderation.service";
import { AiComfortService } from "./ai-comfort.service";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

import { AI_COMFORT_PREFIX } from "@/constants/ai-comfort.constant";

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
      this.triggerAsyncAiComfort(unburden.id, data.title, data.content);
    }

    return { unburden };
  }

  private triggerAsyncAiComfort(
    unburdenId: string,
    title: string,
    content: string,
  ): void {
    if (!this.commentRepository) return;

    const commentRepository = this.commentRepository;
    const comfortService = this.comfortService;

    (async () => {
      try {
        const comfortMessage = await comfortService.generateComfortMessage(
          title,
          content,
        );
        if (comfortMessage) {
          await commentRepository.create({
            unburdenId,
            content: `${AI_COMFORT_PREFIX}${comfortMessage.trim()}`,
            sensitiveContent: false,
          });
        }
      } catch (comfortError) {
        console.warn(
          "Não foi possível gerar mensagem de conforto inicial em background:",
          comfortError,
        );
      }
    })().catch((err) => {
      console.warn("Erro não tratado no worker de acolhimento IA:", err);
    });
  }
}
