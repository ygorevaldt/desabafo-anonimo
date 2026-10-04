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
  comfortPromise?: Promise<void>;
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

    let comfortPromise: Promise<void> | undefined;

    if (data.wantsAiComfort && this.commentRepository) {
      comfortPromise = this.triggerAsyncAiComfort(
        unburden.id,
        data.title,
        data.content,
      );
    }

    return { unburden, comfortPromise };
  }

  private async triggerAsyncAiComfort(
    unburdenId: string,
    title: string,
    content: string,
  ): Promise<void> {
    if (!this.commentRepository) return;

    const commentRepository = this.commentRepository;
    const comfortService = this.comfortService;

    try {
      console.log(
        `[AiComfort] Iniciando geração de acolhimento para o desabafo ${unburdenId}...`,
      );
      const comfortMessage = await comfortService.generateComfortMessage(
        title,
        content,
      );

      const messageToSave =
        comfortMessage?.trim() || comfortService.fallbackComfortMessage();

      await commentRepository.create({
        unburdenId,
        content: `${AI_COMFORT_PREFIX}${messageToSave}`,
        sensitiveContent: false,
      });

      console.log(
        `[AiComfort] Acolhimento gravado com sucesso para o desabafo ${unburdenId}.`,
      );
    } catch (error) {
      console.error(
        `[AiComfort] Erro ao processar acolhimento para o desabafo ${unburdenId}:`,
        error,
      );
      try {
        const fallbackText = comfortService.fallbackComfortMessage();
        await commentRepository.create({
          unburdenId,
          content: `${AI_COMFORT_PREFIX}${fallbackText}`,
          sensitiveContent: false,
        });
        console.log(
          `[AiComfort] Mensagem de fallback gravada com sucesso após erro para ${unburdenId}.`,
        );
      } catch (fallbackError) {
        console.error(
          `[AiComfort] Falha crítica ao persistir fallback para o desabafo ${unburdenId}:`,
          fallbackError,
        );
      }
    }
  }
}
