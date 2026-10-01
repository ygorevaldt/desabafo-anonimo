import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { PrismaReportRepository } from "@/app/api/repositories/report/prisma-report.repository";
import { RegisterReportService, AuditTrigger } from "../register-report.service";
import { makeAuditUnburdenService } from "./make-audit-unburden-service";

export function makeRegisterReportService(auditTrigger?: AuditTrigger) {
  const unburdenRepository = new PrismaUnburdenRepository();
  const reportRepository = new PrismaReportRepository();
  const defaultTrigger: AuditTrigger = (unburdenId: string) => {
    makeAuditUnburdenService().triggerAsyncAudit(unburdenId);
  };

  const service = new RegisterReportService(
    unburdenRepository,
    reportRepository,
    auditTrigger ?? defaultTrigger,
  );

  return service;
}
