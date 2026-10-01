import { IService } from "./service.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";
import { IReportRepository } from "../repositories/report/report-repository.interface";
import { RegisterNotFoundException } from "./exceptions/register-not-found.exception";
import { ReportResponseDto } from "../v1/dtos/report-response.dto";
import { REPORT_AUDIT_THRESHOLD } from "../constants/report-constants";

export type RegisterReportInput = {
  unburdenId: string;
  sessionId: string;
  reason?: string;
};

export type AuditTrigger = (unburdenId: string) => Promise<void> | void;

export class RegisterReportService
  implements IService<RegisterReportInput, ReportResponseDto>
{
  constructor(
    private unburdenRepository: IUnburdenRepository,
    private reportRepository: IReportRepository,
    private auditTrigger?: AuditTrigger,
    private threshold: number = REPORT_AUDIT_THRESHOLD,
  ) {}

  async execute(data: RegisterReportInput): Promise<ReportResponseDto> {
    const unburden = await this.unburdenRepository.findUnique({
      id: data.unburdenId,
      sessionId: data.sessionId,
    });

    if (!unburden) {
      throw new RegisterNotFoundException();
    }

    const existingReport = await this.reportRepository.findBySessionAndUnburden(
      data.sessionId,
      data.unburdenId,
    );

    if (existingReport) {
      const reportCount = await this.reportRepository.countByUnburdenId(
        data.unburdenId,
      );
      return {
        success: true,
        alreadyReported: true,
        reportCount,
        message: "Você já sinalizou este desabafo para moderação.",
      };
    }

    await this.reportRepository.create({
      sessionId: data.sessionId,
      unburdenId: data.unburdenId,
      reason: data.reason,
    });

    const reportCount = await this.reportRepository.countByUnburdenId(
      data.unburdenId,
    );

    if (reportCount >= this.threshold && this.auditTrigger) {
      try {
        Promise.resolve(this.auditTrigger(data.unburdenId)).catch(() => {});
      } catch {}
    }

    return {
      success: true,
      alreadyReported: false,
      reportCount,
      message: "Denúncia registrada com sucesso para análise da moderação.",
    };
  }
}
