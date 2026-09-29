"use client";

import Link from "next/link";
import { UnburdenType } from "@/types/unburden.type";
import { FaEye, FaEyeSlash, FaHashtag, FaFlag, FaPhoneAlt, FaComment, FaHeart } from "react-icons/fa";
import { Time } from "./Time";
import { useState } from "react";
import { confirmReportAlert, successAlert } from "@/utils/alert";
import { Badge } from "./ui/badge";
import { SupportButton } from "./SupportButton";

type UnburdenProps = {
  data: UnburdenType;
  className?: string;
  showSensitiveButton?: boolean;
  showSupportButton?: boolean;
  titleHref?: string;
};

export function Unburden({
  data,
  className = "",
  showSensitiveButton = true,
  showSupportButton = false,
  titleHref,
}: UnburdenProps) {
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [reported, setReported] = useState(false);

  function handleShowSensitiveContent(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowSensitiveContent(!showSensitiveContent);
  }

  async function handleReport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (reported) {
      successAlert("Este desabafo já foi sinalizado para a moderação.");
      return;
    }

    const confirmed = await confirmReportAlert();
    if (confirmed) {
      setReported(true);
      successAlert(
        "Obrigado. Este desabafo foi enviado para análise da moderação."
      );
    }
  }

  return (
    <article
      className={`
        group relative flex flex-col gap-4
        bg-card text-card-foreground
        border border-border/80 hover:border-rose-400/40
        rounded-3xl p-5 sm:p-7
        shadow-soft hover:shadow-soft-md
        transition-all duration-200
        ${className}
      `}
    >
      {/* Header: Title and Time */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-rose-500 transition-colors flex items-center gap-1.5">
          <span className="text-rose-400/80 text-sm">#</span>
          {titleHref ? (
            <Link
              href={titleHref}
              className="focus:outline-none hover:underline decoration-rose-400/40 underline-offset-4"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {data.title}
            </Link>
          ) : (
            <span>{data.title}</span>
          )}
        </h2>
        <Time
          publishedAt={new Date(data.created_at)}
          className="text-xs text-muted-foreground shrink-0 font-medium relative z-10"
        />
      </div>

      {/* Content Area */}
      {data.sensitive_content ? (
        <div className="flex flex-col gap-3">
          {/* Sensitive Alert Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-3.5 py-2.5 rounded-2xl relative z-10">
            <span className="font-medium flex items-center gap-1.5">
              ⚠️ Contém temas delicados ou desabafo sensível
            </span>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPhoneAlt className="text-[10px]" /> Apoio 188
            </a>
          </div>

          <div className="relative">
            <div
              className={`${
                showSensitiveContent ? "blur-none select-text" : "blur-md select-none opacity-40"
              } transition-all duration-300 w-full`}
            >
              <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed text-foreground/90">
                {data.content}
              </p>
            </div>

            {!showSensitiveContent && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="bg-card/90 text-foreground border border-border px-4 py-2 rounded-full text-xs font-medium shadow-soft">
                  Conteúdo sensível protegido
                </span>
              </div>
            )}

            {showSensitiveButton && (
              <button
                type="button"
                onClick={handleShowSensitiveContent}
                className="mt-3 text-xs inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted px-4 py-2 rounded-full border border-border/60 transition-colors relative z-10 cursor-pointer"
              >
                {showSensitiveContent ? (
                  <>
                    <FaEyeSlash className="w-3.5 h-3.5 text-rose-500" />
                    <span>Ocultar conteúdo sensível</span>
                  </>
                ) : (
                  <>
                    <FaEye className="w-3.5 h-3.5 text-rose-500" />
                    <span>Visualizar conteúdo sensível</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed text-foreground/90">
          {data.content}
        </p>
      )}

      {/* Footer Meta: Denunciar (left) and Metrics + Support Button (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-1 border-t border-border/60 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={handleReport}
          title="Denunciar conteúdo abusivo ou proibido"
          className="relative z-10 inline-flex items-center gap-1.5 hover:text-rose-500 transition-colors text-xs text-muted-foreground cursor-pointer"
        >
          <FaFlag className={`w-3 h-3 ${reported ? "text-rose-500" : ""}`} />
          <span>{reported ? "Sinalizado" : "Denunciar"}</span>
        </button>

        <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 ml-auto">
          {data.comments_amount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
              <FaComment className="w-3.5 h-3.5 text-muted-foreground/80" />
              <span>
                {data.comments_amount} {data.comments_amount === 1 ? "comentário" : "comentários"}
              </span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
            <FaHeart className={`w-3.5 h-3.5 ${data.supports_amount > 0 ? "text-rose-500" : "text-muted-foreground/60"}`} />
            <span>
              {data.supports_amount} {data.supports_amount === 1 ? "apoio" : "apoios"}
            </span>
          </span>

          {showSupportButton && (
            <SupportButton unburden={data} />
          )}
        </div>
      </div>
    </article>
  );
}
