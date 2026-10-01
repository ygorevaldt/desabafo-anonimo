import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";
import { AiModerationService } from "./ai-moderation.service";
import { database } from "../infra/database";

export class AuditUnburdenService {
  constructor(
    private unburdenRepository: IUnburdenRepository,
    private moderationService: AiModerationService = new AiModerationService(),
  ) {}

  async audit(unburdenId: string): Promise<void> {
    const unburden = await database.unburden.findUnique({
      where: { id: unburdenId },
    });

    if (!unburden || unburden.deletedAt) {
      return;
    }

    const verdict = await this.moderationService.moderate(
      unburden.content,
      unburden.title,
    );

    if (verdict.status === "BLOCKED") {
      await this.unburdenRepository.softDelete(unburdenId);
      return;
    }

    if (verdict.isSensitive && !unburden.sensitiveContent) {
      await database.unburden.update({
        where: { id: unburdenId },
        data: { sensitiveContent: true },
      });
    }
  }

  triggerAsyncAudit(unburdenId: string): void {
    (async () => {
      try {
        await this.audit(unburdenId);
      } catch {}
    })().catch(() => {});
  }
}
