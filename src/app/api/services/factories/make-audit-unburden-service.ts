import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { AiModerationService } from "../ai-moderation.service";
import { AuditUnburdenService } from "../audit-unburden.service";

export function makeAuditUnburdenService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const moderationService = new AiModerationService();
  const service = new AuditUnburdenService(
    unburdenRepository,
    moderationService,
  );

  return service;
}
